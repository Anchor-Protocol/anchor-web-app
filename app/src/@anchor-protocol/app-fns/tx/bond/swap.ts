import { formatLuna } from '@anchor-protocol/notation';
import {
  bLuna,
  CW20Addr,
  Gas,
  HumanAddr,
  Luna,
  Rate,
  u,
  UST,
} from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
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
import {
  demicrofy,
  formatFluidDecimalPoints,
  formatTokenInput,
} from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import big, { Big, BigSource } from 'big.js';
import { Observable } from 'rxjs';

export function bondSwapTx($: {
  walletAddr: HumanAddr;
  bAssetTokenAddr: CW20Addr;
  bAssetPairAddr: HumanAddr;
  burnAmount: bLuna;
  beliefPrice: Rate;
  maxSpread: Rate;

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
        new MsgExecuteContract($.walletAddr, $.bAssetTokenAddr, {
          send: {
            contract: $.bAssetPairAddr,
            amount: formatTokenInput($.burnAmount),
            msg: createHookMsg({
              swap: {
                belief_price: $.beliefPrice,
                max_spread: $.maxSpread,
              },
            }),
          },
        }),
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
        const boughtAmount = pickAttributeValueByKey<u<Luna>>(
          fromContract,
          'return_amount',
        );
        const paidAmount = pickAttributeValueByKey<u<bLuna>>(
          fromContract,
          'offer_amount',
        );
        const spreadAmount = pickAttributeValueByKey<u<Luna>>(
          fromContract,
          'spread_amount',
        );
        const commissionAmount = pickAttributeValueByKey<u<Luna>>(
          fromContract,
          'commission_amount',
        );

        const exchangeRate =
          boughtAmount &&
          paidAmount &&
          (big(boughtAmount).div(paidAmount) as Rate<BigSource> | undefined);

        const tradingFee =
          commissionAmount &&
          spreadAmount &&
          (big(commissionAmount).plus(spreadAmount) as u<Luna<Big>>);

        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            paidAmount && {
              name: 'Paid Amount',
              value: `${formatLuna(demicrofy(paidAmount))} bLUNA`,
            },
            boughtAmount && {
              name: 'Bought Amount',
              value: `${formatLuna(demicrofy(boughtAmount))} LUNA`,
            },
            exchangeRate && {
              name: 'Exchange Rate',
              value: `${formatFluidDecimalPoints(
                exchangeRate,
                6,
              )} LUNA per bLUNA`,
            },
            helper.txHashReceipt(),
            tradingFee && {
              name: 'Trading Fee',
              value: formatLuna(demicrofy(tradingFee)) + ' LUNA',
            },
            helper.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
