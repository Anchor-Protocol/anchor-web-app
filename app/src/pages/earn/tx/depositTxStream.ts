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
import { ApolloClient } from '@apollo/client';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@terra-dev/big-math';
import { OperationTimeoutError } from '@terra-dev/broadcastable-operation';
import { txTimeout } from '@terra-dev/tx-helpers';
import { Timeout, TxResult, UserDenied } from '@terra-dev/wallet-types';
import { CreateTxOptions, StdFee } from '@terra-money/terra.js';
import { TxHashLink } from 'base/components/TxHashLink';
import {
  pickAttributeValue,
  pickEvent,
  pickRawLog,
} from 'base/queries/txInfos';
import big, { BigSource } from 'big.js';
import { parseError, TxRender, TxStreamPhase } from 'models/tx';
import { pollTxInfo } from 'queries/pollTxInfo';
import { createElement } from 'react';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function depositTxStream(
  $: Parameters<typeof fabricateMarketDepositStableCoin>[0] & {
    gasFee: uUST<number>;
    gasAdjustment: Rate<number>;
    txFee: uUST;
    addressProvider: AddressProvider;
    client: ApolloClient<any>;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    reportError?: (error: unknown) => string;
    dispatchEvent: (eventType: string) => void;
  },
): Observable<TxRender> {
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
      //throw new Timeout('Shit...!!!!');

      return {
        value: {
          msgs: fabricateMarketDepositStableCoin($)($.addressProvider),
          fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
          //fee: new StdFee($.gasFee, '10uusd'),
          gasAdjustment: $.gasAdjustment,
        },

        phase: TxStreamPhase.POST,
        receipts: [],
      } as TxRender<CreateTxOptions>;
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
          } as TxRender<TxResult>;
        },
      );
    },
    // ---------------------------------------------
    // waiting broadcast result
    // ---------------------------------------------
    ({ value: txResult }) => {
      return pollTxInfo(
        $.client,
        savedTx,
      )(txResult).then((txInfo) => {
        $.dispatchEvent('tx-completed');

        const rawLog = pickRawLog(txInfo, 0);

        if (!rawLog) {
          return {
            value: null,

            phase: TxStreamPhase.SUCCEED,
            receiptErrors: [{ title: 'Undefined the RawLog' }],
            receipts: [txHashReceipt(), txFeeReceipt()],
          } as TxRender;
        }

        const fromContract = pickEvent(rawLog, 'from_contract');

        if (!fromContract) {
          return {
            value: null,

            phase: TxStreamPhase.SUCCEED,
            receiptErrors: [{ title: `Undefined the from_contract event` }],
            receipts: [txHashReceipt(), txFeeReceipt()],
          } as TxRender;
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
                  formatAUSTWithPostfixUnits(demicrofy(receivedAmount)) +
                  ' aUST',
              },
              exchangeRate && {
                name: 'Exchange Rate',
                value: formatFluidDecimalPoints(exchangeRate, 6),
              },
              txHashReceipt(),
              txFeeReceipt(),
            ],
          } as TxRender;
        } catch (error) {
          return {
            value: null,

            phase: TxStreamPhase.SUCCEED,
            receiptErrors: [{ title: 'Failed to parse Tx result' }],
            receipts: [txHashReceipt(), txFeeReceipt()],
          } as TxRender;
        }
      });
    },
  )().pipe(
    // ---------------------------------------------
    // tx failed
    // ---------------------------------------------
    catchError((error) => {
      const errorId =
        $.reportError &&
        !(
          error instanceof UserDenied ||
          error instanceof Timeout ||
          error instanceof OperationTimeoutError
        )
          ? $.reportError(error)
          : undefined;

      return Promise.resolve<TxRender>({
        value: null,

        phase: TxStreamPhase.FAILED,
        failedReason: parseError(error, errorId),
        receipts: [txHashReceipt()],
      });
    }),
  );
}
