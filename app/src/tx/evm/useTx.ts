import { StreamReturn, useStream } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import {
  merge,
  from,
  map,
  tap,
  BehaviorSubject,
  Subject,
  ReplaySubject,
} from 'rxjs';
import { useCallback, useMemo } from 'react';
import { TxReceipt, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { truncateEvm } from '@libs/formatter';
import { catchTxError } from './catchTxError';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { CrossChainEvent } from '@anchor-protocol/crossanchor-sdk';

export type TxEventHandler<TxParams> = (
  event: CrossChainEvent<ContractReceipt>,
  txParams: TxParams,
) => void;

export type TxEvent<TxParams> = {
  event: CrossChainEvent<ContractReceipt>;
  txParams: TxParams;
};

export const useTx = <TxParams, TxResult>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxResultRendering<TxResult>>,
    txEvents: Subject<TxEvent<TxParams>>,
  ) => Promise<TxResult>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
): StreamReturn<TxParams, TxResultRendering<TxResult>> => {
  const { txErrorReporter } = useAnchorWebapp();

  // TODO: represent renderingEvents stream as txEvents.map(render) and remove the need for two subjects
  const txEvents = useMemo(() => new ReplaySubject<TxEvent<TxParams>>(1), []);
  const renderingEvents = useMemo(
    () =>
      new BehaviorSubject<TxResultRendering<TxResult>>({
        value: emptyTxResult,
        message: 'Processing transaction...',
        phase: TxStreamPhase.BROADCAST,
        receipts: [],
      }),
    [emptyTxResult],
  );

  const txCallback = useCallback(
    (txParams: TxParams) => {
      return merge(
        from(sendTx(txParams, renderingEvents, txEvents))
          .pipe(
            map((txResult) => {
              renderingEvents.complete();
              txEvents.complete();

              return {
                value: txResult,
                phase: TxStreamPhase.SUCCEED,
                receipts: [txReceipt(parseTx(txResult!))],
              };
            }),
          )
          .pipe(catchTxError<TxResult>({ txErrorReporter })),
        renderingEvents,
      ).pipe(
        tap((tx) => {
          console.log('stream emitted', tx);
        }),
      );
    },
    [sendTx, parseTx, txErrorReporter, renderingEvents, txEvents],
  );

  return useStream(txCallback);
};

const txReceipt = (tx: ContractReceipt): TxReceipt => {
  return {
    name: 'Tx hash',
    value: truncateEvm(tx.transactionHash),
  };
};
