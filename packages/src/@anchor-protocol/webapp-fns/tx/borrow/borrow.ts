import {
  AddressProvider,
  fabricateMarketBorrow,
} from '@anchor-protocol/anchor.js';
import {
  demicrofy,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uUST } from '@anchor-protocol/types';
import {
  BorrowBorrowerData,
  BorrowMarketData,
  computeCurrentLtv,
} from '@anchor-protocol/webapp-fns';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@terra-dev/big-math';
import { txTimeout } from '@terra-dev/tx-helpers';
import { Timeout, TxResult, UserDenied } from '@terra-dev/wallet-types';
import { CreateTxOptions, StdFee } from '@terra-money/terra.js';
import {
  MantleFetch,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
  pollTxInfo,
  TxHashLink,
  TxInfoData,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import { createElement } from 'react';
import { QueryObserverResult } from 'react-query';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function borrowBorrowTx(
  $: Parameters<typeof fabricateMarketBorrow>[0] & {
    gasFee: uUST<number>;
    gasAdjustment: Rate<number>;
    txFee: uUST;
    addressProvider: AddressProvider;
    mantleEndpoint: string;
    mantleFetch: MantleFetch;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    borrowMarketQuery: () => Promise<
      QueryObserverResult<BorrowMarketData | undefined>
    >;
    borrowBorrowerQuery: () => Promise<
      QueryObserverResult<BorrowBorrowerData | undefined>
    >;
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
          msgs: fabricateMarketBorrow($)($.addressProvider),
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
    ({ value: txResult }) => {
      return pollTxInfo({
        mantleEndpoint: $.mantleEndpoint,
        mantleFetch: $.mantleFetch,
        tx: savedTx,
        txhash: txResult.result.txhash,
      }).then((txInfo) => {
        $.onTxSucceed?.();

        return {
          value: txInfo,

          phase: TxStreamPhase.SUCCEED,
          receipts: [txHashReceipt(), txFeeReceipt()],
        } as TxResultRendering<TxInfoData>;
      });
    },
    ({ value: txInfo }) => {
      return Promise.all([$.borrowMarketQuery(), $.borrowBorrowerQuery()]).then(
        ([{ data: borrowMarket }, { data: borrowBorrower }]) => {
          if (!borrowMarket || !borrowBorrower) {
            return {
              value: null,

              phase: TxStreamPhase.SUCCEED,
              receiptErrors: [
                { error: new Error('Failed to load borrow datas') },
              ],
              receipts: [txHashReceipt(), txFeeReceipt()],
            } as TxResultRendering;
          }

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

          if (!fromContract) {
            return {
              value: null,

              phase: TxStreamPhase.SUCCEED,
              receiptErrors: [
                { error: new Error(`Undefined the from_contract event`) },
              ],
              receipts: [txHashReceipt(), txFeeReceipt()],
            } as TxResultRendering;
          }

          try {
            const borrowedAmount = pickAttributeValue<uUST>(fromContract, 3);

            const newLtv =
              computeCurrentLtv(
                borrowBorrower.marketBorrowerInfo,
                borrowBorrower.custodyBorrower,
                borrowMarket.oraclePrice,
              ) ?? ('0' as Rate);

            const outstandingLoan =
              borrowBorrower.marketBorrowerInfo.loan_amount;

            return {
              value: null,

              phase: TxStreamPhase.SUCCEED,
              receipts: [
                borrowedAmount && {
                  name: 'Borrowed Amount',
                  value:
                    formatUSTWithPostfixUnits(demicrofy(borrowedAmount)) +
                    ' UST',
                },
                newLtv && {
                  name: 'New LTV',
                  value: formatRate(newLtv) + ' %',
                },
                outstandingLoan && {
                  name: 'Outstanding Loan',
                  value:
                    formatUSTWithPostfixUnits(demicrofy(outstandingLoan)) +
                    ' UST',
                },
                txHashReceipt(),
                txFeeReceipt(),
              ],
            } as TxResultRendering;
          } catch (error) {
            return {
              value: null,

              phase: TxStreamPhase.SUCCEED,
              receiptErrors: [
                { error: new Error('Failed to parse Tx result') },
              ],
              receipts: [txHashReceipt(), txFeeReceipt()],
            } as TxResultRendering;
          }
        },
      );
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
