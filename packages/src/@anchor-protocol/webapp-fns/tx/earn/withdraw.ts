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
import { floor } from '@terra-dev/big-math';
import { txTimeout } from '@terra-dev/tx-helpers';
import { Timeout, TxResult, UserDenied } from '@terra-dev/wallet-types';
import { CreateTxOptions, StdFee } from '@terra-money/terra.js';
import {
  MantleFetch,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
  pollTxInfo,
  TxHashLink,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import big, { BigSource } from 'big.js';
import { createElement } from 'react';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function earnWithdrawTx(
  $: Parameters<typeof fabricateMarketRedeemStable>[0] & {
    gasFee: uUST<number>;
    gasAdjustment: Rate<number>;
    txFee: uUST;
    addressProvider: AddressProvider;
    mantleEndpoint: string;
    mantleFetch: MantleFetch;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  let savedTx: CreateTxOptions;
  let savedTxResult: TxResult;

  function txHashReceipt() {
    return savedTxResult
      ? {
          name: 'Tx Hash',
          value: createElement(TxHashLink, {
            txHash: savedTxResult.result.txhash,
          }),
        }
      : null;
  }

  function txFeeReceipt() {
    return {
      name: 'Tx Fee',
      value: formatUSTWithPostfixUnits(demicrofy($.txFee)) + ' UST',
    };
  }

  return pipe(
    // ---------------------------------------------
    // create tx
    // ---------------------------------------------
    (_: void) => {
      return {
        value: {
          msgs: fabricateMarketRedeemStable($)($.addressProvider),
          fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
          gasAdjustment: $.gasAdjustment,
        },

        phase: TxStreamPhase.POST,
        receipts: [],
      } as TxResultRendering<CreateTxOptions>;
    },
    // ---------------------------------------------
    // post tx to wallet
    // ---------------------------------------------
    ({ value: tx }) => {
      savedTx = tx;
      return Promise.race([$.post(tx), txTimeout<TxResult>()]).then(
        (txResult) => {
          savedTxResult = txResult;
          return {
            value: txResult,

            phase: TxStreamPhase.BROADCAST,
            receipts: [txHashReceipt()],
          } as TxResultRendering<TxResult>;
        },
      );
    },
    // ---------------------------------------------
    // waiting broadcast result
    // ---------------------------------------------
    ({ value: txResult }) => {
      return pollTxInfo({
        mantleEndpoint: $.mantleEndpoint,
        mantleFetch: $.mantleFetch,
        tx: savedTx,
        txhash: txResult.result.txhash,
      }).then((txInfo) => {
        $.onTxSucceed?.();

        const rawLog = pickRawLog(txInfo, 0);

        if (!rawLog) {
          return {
            value: null,

            phase: TxStreamPhase.SUCCEED,
            receiptErrors: [{ error: new Error('Undefined the RawLog') }],
            receipts: [txHashReceipt(), txFeeReceipt()],
          } as TxResultRendering;
        }

        const fromContract = pickEvent(rawLog, 'from_contract');
        const transfer = pickEvent(rawLog, 'transfer');

        if (!fromContract || !transfer) {
          return {
            value: null,

            phase: TxStreamPhase.SUCCEED,
            receiptErrors: [
              {
                error: new Error(
                  `Undefined the from_contract or transfer event`,
                ),
              },
            ],
            receipts: [txHashReceipt(), txFeeReceipt()],
          } as TxResultRendering;
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
            (big(withdrawAmount).div(burnAmount) as
              | Rate<BigSource>
              | undefined);

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
              txHashReceipt(),
              txFeeReceipt(),
            ],
          } as TxResultRendering;
        } catch (error) {
          return {
            value: null,

            phase: TxStreamPhase.SUCCEED,
            receiptErrors: [{ error: new Error('Failed to parse Tx result') }],
            receipts: [txHashReceipt(), txFeeReceipt()],
          } as TxResultRendering;
        }
      });
    },
  )().pipe(
    // ---------------------------------------------
    // tx failed
    // ---------------------------------------------
    catchError((error) => {
      const errorId =
        $.txErrorReporter &&
        !(error instanceof UserDenied || error instanceof Timeout)
          ? $.txErrorReporter(error)
          : undefined;

      return Promise.resolve<TxResultRendering>({
        value: null,

        phase: TxStreamPhase.FAILED,
        failedReason: { error, errorId },
        receipts: [txHashReceipt()],
      });
    }),
  );
}
