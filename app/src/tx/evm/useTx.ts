import { StreamReturn, useStream } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { merge, from, map, tap, BehaviorSubject, Subject } from 'rxjs';
import { useCallback } from 'react';
import { TxReceipt, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { truncateEvm } from '@libs/formatter';
import { catchTxError } from './catchTxError';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { CrossChainEvent } from '@anchor-protocol/crossanchor-sdk';

export type TxEventHandler<TxParams> = (
  event: CrossChainEvent<ContractReceipt>,
  txParams: TxParams,
) => void;

export const useTx = <TxParams, TxResult>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxResultRendering<TxResult>>,
    handleEvent: TxEventHandler<TxParams>,
  ) => Promise<TxResult>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
  onTxEvent: TxEventHandler<TxParams> = () => {},
): StreamReturn<TxParams, TxResultRendering<TxResult>> => {
  const { txErrorReporter } = useAnchorWebapp();

  const txCallback = useCallback(
    (txParams: TxParams) => {
      const sdkEvents = new BehaviorSubject<TxResultRendering<TxResult>>({
        value: emptyTxResult,
        message: 'Processing transaction...',
        phase: TxStreamPhase.BROADCAST,
        receipts: [],
      });

      return merge(
        from(sendTx(txParams, sdkEvents, onTxEvent))
          .pipe(
            map((txResult) => {
              sdkEvents.complete();

              return {
                value: txResult,
                phase: TxStreamPhase.SUCCEED,
                receipts: [txReceipt(parseTx(txResult!))],
              };
            }),
          )
          .pipe(catchTxError<TxResult>({ txErrorReporter })),
        sdkEvents,
      ).pipe(
        tap((tx) => {
          //console.log('stream emitted', tx);
        }),
      );
    },
    [sendTx, emptyTxResult, parseTx, txErrorReporter, onTxEvent],
  );

  return useStream(txCallback);
};

const txReceipt = (tx: ContractReceipt): TxReceipt => {
  return {
    name: 'Tx hash',
    value: truncateEvm(tx.transactionHash),
  };
};
