import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import {
  basset,
  bAsset,
  cw20,
  CW20Addr,
  Gas,
  HumanAddr,
  Rate,
  u,
  UST,
} from '@anchor-protocol/types';
import {
  pickAttributeValue,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  createHookMsg,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor } from '@libs/big-math';
import { demicrofy, formatTokenInput, stripUUSD } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';

export function bAssetImportTx($: {
  walletAddr: HumanAddr;
  converterAddr: HumanAddr;
  wormholeTokenAddr: CW20Addr;
  wormholeTokenAmount: bAsset;

  gasFee: Gas;
  gasAdjustment: Rate<number>;
  fixedGas: u<UST>;
  network: NetworkInfo;
  queryClient: QueryClient;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  txErrorReporter?: (error: unknown) => string;
  onTxSucceed?: () => void;
}): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddr, $.wormholeTokenAddr, {
          send: {
            contract: $.converterAddr,
            amount: formatTokenInput($.wormholeTokenAmount),
            msg: createHookMsg({
              convert_wormhole_to_anchor: {},
            } as basset.converter.ConvertWormholeToAnchor),
          },
        } as cw20.Send<bAsset>),
      ],
      fee: new Fee($.gasFee, floor($.fixedGas) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const rawLog = pickRawLog(txInfo, 0);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const transfer = pickEvent(rawLog, 'transfer');

      if (!transfer) {
        return helper.failedToFindEvents('transfer');
      }

      // https://finder.terra.money/bombay-12/tx/343E30771368EBB96CAE04E8260EF0E96949D2569DDAA3356B2C09AB75B65F73

      try {
        const claimedReward = pickAttributeValue<string>(transfer, 5);

        const txFee = pickAttributeValue<string>(transfer, 2);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            !!claimedReward && {
              name: 'Claimed Reward',
              value:
                formatUSTWithPostfixUnits(demicrofy(stripUUSD(claimedReward))) +
                ' UST',
            },
            helper.txHashReceipt(),
            {
              name: 'Tx Fee',
              value:
                formatUSTWithPostfixUnits(
                  demicrofy(
                    big(txFee ? stripUUSD(txFee) : '0').plus($.fixedGas) as u<
                      UST<Big>
                    >,
                  ),
                ) + ' UST',
            },
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
