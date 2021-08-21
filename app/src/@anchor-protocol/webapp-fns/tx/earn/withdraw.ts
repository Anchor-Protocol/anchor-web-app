import {
  AddressProvider,
  fabricateMarketRedeemStable,
} from '@anchor-protocol/anchor.js';
import {
  demicrofy,
  formatAUSTWithPostfixUnits,
  formatFluidDecimalPoints,
  formatUSTWithPostfixUnits,
  stripUUSD,
} from '@anchor-protocol/notation';
import { Rate, uaUST, uUST } from '@anchor-protocol/types';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@packages/big-math';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions, StdFee } from '@terra-money/terra.js';
import {
  MantleFetch,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@packages/webapp-fns';
import big, { BigSource } from 'big.js';
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';

export function earnWithdrawTx(
  $: Parameters<typeof fabricateMarketRedeemStable>[0] & {
    gasFee: uUST<number>;
    gasAdjustment: Rate<number>;
    txFee: uUST;
    network: NetworkInfo;
    addressProvider: AddressProvider;
    mantleEndpoint: string;
    mantleFetch: MantleFetch;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: fabricateMarketRedeemStable($)($.addressProvider),
      fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
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
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return helper.failedToFindEvents('from_contract', 'transfer');
      }

      try {
        const withdrawAmountUUSD = pickAttributeValueByKey<string>(
          transfer,
          'amount',
          (attrs) => attrs.reverse()[0],
        );

        const withdrawAmount = withdrawAmountUUSD
          ? stripUUSD(withdrawAmountUUSD)
          : undefined;

        const burnAmount = pickAttributeValueByKey<uaUST>(
          fromContract,
          'burn_amount',
        );

        const exchangeRate =
          withdrawAmount &&
          burnAmount &&
          (big(withdrawAmount).div(burnAmount) as Rate<BigSource> | undefined);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            withdrawAmount && {
              name: 'Withdraw Amount',
              value:
                formatUSTWithPostfixUnits(demicrofy(withdrawAmount)) + ' UST',
            },
            burnAmount && {
              name: 'Returned Amount',
              value:
                formatAUSTWithPostfixUnits(demicrofy(burnAmount)) + ' aUST',
            },
            exchangeRate && {
              name: 'Exchange Rate',
              value: formatFluidDecimalPoints(exchangeRate, 6),
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
