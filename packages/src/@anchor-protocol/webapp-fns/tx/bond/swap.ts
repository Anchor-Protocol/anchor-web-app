import {
  AddressProvider,
  fabricateTerraswapSwapbLuna,
} from '@anchor-protocol/anchor.js';
import {
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
} from '@anchor-protocol/notation';
import { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
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
import big, { Big, BigSource } from 'big.js';
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';

export function bondSwapTx(
  $: Parameters<typeof fabricateTerraswapSwapbLuna>[0] & {
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
      msgs: fabricateTerraswapSwapbLuna($)($.addressProvider),
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
        const boughtAmount = pickAttributeValue<uLuna>(fromContract, 18);
        const paidAmount = pickAttributeValue<ubLuna>(fromContract, 17);
        const tradingFee1 = pickAttributeValue<uLuna>(fromContract, 20);
        const tradingFee2 = pickAttributeValue<uLuna>(fromContract, 21);

        const exchangeRate =
          boughtAmount &&
          paidAmount &&
          (big(boughtAmount).div(paidAmount) as Rate<BigSource> | undefined);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            paidAmount && {
              name: 'Paid Amount',
              value: formatLuna(demicrofy(paidAmount)) + ' bLuna',
            },
            boughtAmount && {
              name: 'Bought Amount',
              value: formatLuna(demicrofy(boughtAmount)) + ' Luna',
            },
            exchangeRate && {
              name: 'Exchange Rate',
              value: formatFluidDecimalPoints(exchangeRate, 6),
            },
            helper.txHashReceipt(),
            tradingFee1 &&
              tradingFee2 && {
                name: 'Trading Fee',
                value:
                  formatLuna(
                    demicrofy(big(tradingFee1).plus(tradingFee2) as uLuna<Big>),
                  ) + ' Luna',
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
