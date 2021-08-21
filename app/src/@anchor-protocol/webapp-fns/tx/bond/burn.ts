import {
  AddressProvider,
  fabricatebAssetUnbond,
} from '@anchor-protocol/anchor.js';
import {
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
} from '@anchor-protocol/notation';
import { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import { pipe } from '@rx-stream/pipe';
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

export function bondBurnTx(
  $: Parameters<typeof fabricatebAssetUnbond>[0] & {
    gasFee: uUST<number>;
    gasAdjustment: Rate<number>;
    fixedGas: uUST;
    network: NetworkInfo;
    addressProvider: AddressProvider;
    mantleEndpoint: string;
    mantleFetch: MantleFetch;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  return pipe(
    _createTxOptions({
      msgs: fabricatebAssetUnbond($)($.addressProvider),
      fee: new StdFee($.gasFee, $.fixedGas + 'uusd'),
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
        const burnedAmount = pickAttributeValueByKey<uLuna>(
          fromContract,
          'amount',
          (attrs) => attrs[0],
        );
        const expectedAmount = pickAttributeValueByKey<ubLuna>(
          fromContract,
          'amount',
          (attrs) => attrs.reverse()[0],
        );

        const exchangeRate =
          burnedAmount &&
          expectedAmount &&
          (big(expectedAmount).div(burnedAmount) as
            | Rate<BigSource>
            | undefined);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            burnedAmount && {
              name: 'Burned Amount',
              value: formatLuna(demicrofy(burnedAmount)) + ' bLUNA',
            },
            expectedAmount && {
              name: 'Expected Amount',
              value: formatLuna(demicrofy(expectedAmount)) + ' LUNA',
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
