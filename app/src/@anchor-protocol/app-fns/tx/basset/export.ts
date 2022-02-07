import { BAssetInfoWithDisplay } from '@anchor-protocol/app-provider';
import {
  basset,
  bAsset,
  cw20,
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
import { formatTokenInput, formatNumeric } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { Observable } from 'rxjs';

export function bAssetExportTx($: {
  walletAddr: HumanAddr;
  bAssetInfo: BAssetInfoWithDisplay;
  bAssetTokenAmount: bAsset;
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

  const converterAddr = $.bAssetInfo.minter.minter;
  const bAssetTokenAddr = $.bAssetInfo.converterConfig.anchor_token_address!;

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddr, bAssetTokenAddr, {
          send: {
            contract: converterAddr,
            amount: formatTokenInput($.bAssetTokenAmount),
            msg: createHookMsg({
              convert_anchor_to_wormhole: {},
            } as basset.converter.ConvertAnchorToWormhole),
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

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const returnAmount = pickAttributeValue<u<bAsset>>(fromContract, 16);
        const burnAmount = pickAttributeValue<u<bAsset>>(fromContract, 17);

        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            burnAmount && {
              name: 'Provided amount',
              value:
                formatNumeric(burnAmount as u<any>) +
                ` ${$.bAssetInfo.tokenDisplay.anchor.symbol}`,
            },
            returnAmount && {
              name: 'Converted amount',
              value:
                formatNumeric(
                  returnAmount as u<any>,
                  $.bAssetInfo.tokenDisplay.wormhole.decimals,
                ) + ` ${$.bAssetInfo.tokenDisplay.wormhole.symbol}`,
            },
            {
              name: 'Exchange rate',
              value: `1 ${$.bAssetInfo.tokenDisplay.anchor.symbol} per ${$.bAssetInfo.tokenDisplay.wormhole.symbol}`,
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
