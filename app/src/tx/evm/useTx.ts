import { StreamReturn, useStream } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import {
  merge,
  from,
  map,
  catchError,
  tap,
  BehaviorSubject,
  Subject,
} from 'rxjs';
import { useCallback, useMemo } from 'react';
import { TxReceipt, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { UserDenied } from '@terra-money/use-wallet';
import { truncateEvm } from '@libs/formatter';

export const useTx = <TxParams, TxResult>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxResultRendering<TxResult>>,
  ) => Promise<TxResult>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
): StreamReturn<TxParams, TxResultRendering<TxResult>> => {
  const sdkEvents = useMemo(() => {
    return new BehaviorSubject<TxResultRendering<TxResult>>({
      value: emptyTxResult,
      message: 'Processing transaction...',
      phase: TxStreamPhase.BROADCAST,
      receipts: [],
    });
  }, [emptyTxResult]);

  const txCallback = useCallback(
    (txParams: TxParams) => {
      return merge(
        from(sendTx(txParams, sdkEvents))
          .pipe(
            map((txResult) => {
              return {
                value: emptyTxResult,
                phase: TxStreamPhase.SUCCEED,
                receipts: [txReceipt(parseTx(txResult!))],
              };
            }),
          )
          .pipe(
            catchError((error) => {
              console.log('useTx error', error);
              throw error.code === 4001 ? new UserDenied() : error;
            }),
          ),
        sdkEvents,
      ).pipe(
        tap((tx) => {
          console.log('stream emitted', tx);
        }),
      );
    },
    [sdkEvents, sendTx, emptyTxResult, parseTx],
  );

  return useStream(txCallback);
};

const txReceipt = (tx: ContractReceipt): TxReceipt => {
  return {
    name: 'Tx hash',
    value: truncateEvm(tx.transactionHash),
  };
};
