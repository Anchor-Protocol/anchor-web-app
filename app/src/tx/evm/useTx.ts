import { StreamReturn, useStream } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { merge, from, map, tap, BehaviorSubject, Subject } from 'rxjs';
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
  ) => Promise<TxResult | null>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
): StreamReturn<TxParams, TxResultRendering<TxResult>> => {
  const { txErrorReporter } = useAnchorWebapp();

  // TODO: represent renderingEvents stream as txEvents.map(render) and remove the need for two subjects
  const txEvents = useMemo(() => new Subject<TxEvent<TxParams>>(), []);
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

  // TODO: add synchronized closure hooks with subjects + sendTx fn args (onTxEvent example, but for each tx)
  // then add removeTransaction after usePersisted and see if it works...

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
                receipts: Boolean(txResult)
                  ? [txReceipt(parseTx(txResult!))]
                  : [],
              };
            }),
          )
          .pipe(catchTxError<TxResult | null>({ txErrorReporter })),
        renderingEvents,
      ).pipe(
        tap((tx) => {
          //console.log('stream emitted', tx);
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
