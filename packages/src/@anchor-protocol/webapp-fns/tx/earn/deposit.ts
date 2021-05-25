import {
  AddressProvider,
  fabricateMarketDepositStableCoin,
} from '@anchor-protocol/anchor.js';
import {
  demicrofy,
  formatAUSTWithPostfixUnits,
  formatFluidDecimalPoints,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uaUST, uUST } from '@anchor-protocol/types';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@terra-dev/big-math';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions, StdFee } from '@terra-money/terra.js';
import {
  MantleFetch,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import big, { BigSource } from 'big.js';
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';

export function earnDepositTx(
  $: Parameters<typeof fabricateMarketDepositStableCoin>[0] & {
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
      msgs: fabricateMarketDepositStableCoin($)($.addressProvider),
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

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const depositAmount = pickAttributeValue<uUST>(fromContract, 4);

        const receivedAmount = pickAttributeValue<uaUST>(fromContract, 3);

        const exchangeRate =
          depositAmount &&
          receivedAmount &&
          (big(depositAmount).div(receivedAmount) as
            | Rate<BigSource>
            | undefined);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            depositAmount && {
              name: 'Deposit Amount',
              value:
                formatUSTWithPostfixUnits(demicrofy(depositAmount)) + ' UST',
            },
            receivedAmount && {
              name: 'Received Amount',
              value:
                formatAUSTWithPostfixUnits(demicrofy(receivedAmount)) + ' aUST',
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
