import {
  AddressProvider,
  fabricateExchangeSwapbLuna,
} from '@anchor-protocol/anchor.js';
import { formatLuna } from '@anchor-protocol/notation';
import { bLuna, Gas, Luna, Rate, u, UST } from '@anchor-protocol/types';
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
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor } from '@libs/big-math';
import { demicrofy, formatFluidDecimalPoints } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { CreateTxOptions, Fee } from '@terra-money/terra.js';
import big, { Big, BigSource } from 'big.js';
import { Observable } from 'rxjs';

export function bondSwapTx(
  $: Parameters<typeof fabricateExchangeSwapbLuna>[0] & {
    gasFee: Gas;
    gasAdjustment: Rate<number>;
    fixedGas: u<UST>;
    network: NetworkInfo;
    addressProvider: AddressProvider;
    queryClient: QueryClient;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  return pipe(
    _createTxOptions({
      msgs: fabricateExchangeSwapbLuna($)($.addressProvider),
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
        const boughtAmount = pickAttributeValue<u<Luna>>(fromContract, 18);
        const paidAmount = pickAttributeValue<u<bLuna>>(fromContract, 17);
        const tradingFee1 = pickAttributeValue<u<Luna>>(fromContract, 20);
        const tradingFee2 = pickAttributeValue<u<Luna>>(fromContract, 21);

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
              value: formatLuna(demicrofy(paidAmount)) + ' bLUNA',
            },
            boughtAmount && {
              name: 'Bought Amount',
              value: formatLuna(demicrofy(boughtAmount)) + ' LUNA',
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
                    demicrofy(
                      big(tradingFee1).plus(tradingFee2) as u<Luna<Big>>,
                    ),
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
