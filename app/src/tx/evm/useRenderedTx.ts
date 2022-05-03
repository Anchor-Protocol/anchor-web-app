import { StreamReturn, useStream } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { merge, from, map, BehaviorSubject, Subject } from 'rxjs';
import { useCallback, useMemo } from 'react';
import { TxReceipt, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { truncateEvm } from '@libs/formatter';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { CrossChainEvent } from '@anchor-protocol/crossanchor-sdk';
import { catchTxError } from './catchTxError';

export type TxEventHandler<TxParams> = (
  event: CrossChainEvent<ContractReceipt>,
  txParams: TxParams,
) => void;

export type TxEvent<TxParams> = {
  event: CrossChainEvent<ContractReceipt>;
  txParams: TxParams;
};

export type RenderedTxResult<TxParams> = {
  stream: StreamReturn<TxParams, TxResultRendering<ContractReceipt>>;
  renderTxResults: Subject<TxResultRendering<ContractReceipt | null>>;
};

export const useRenderedTx = <TxParams>(
  sendTx: (txParams: TxParams) => Promise<ContractReceipt | null>,
): RenderedTxResult<TxParams> => {
  const { txErrorReporter } = useAnchorWebapp();

  const renderingEvents = useMemo(
    () =>
      new BehaviorSubject<TxResultRendering<ContractReceipt | null>>({
        value: null,
        message: 'Processing transaction...',
        phase: TxStreamPhase.BROADCAST,
        receipts: [],
      }),
    [],
  );

  const txCallback = useCallback(
    (txParams: TxParams) => {
      return merge(
        from(sendTx(txParams))
          .pipe(
            map((txResult) => {
              renderingEvents.complete();

              return {
                value: txResult,
                phase: TxStreamPhase.SUCCEED,
                receipts: txResult ? [txReceipt(txResult)] : [],
              };
            }),
          )
          .pipe(
            catchTxError<ContractReceipt | null>({
              txErrorReporter,
            }),
          ),
        renderingEvents,
      );
    },
    [sendTx, txErrorReporter, renderingEvents],
  );

  const [fetch, result] = useStream(txCallback);
  const txStreamResult = useMemo(
    () => ({
      stream: [fetch, result] as StreamReturn<
        TxParams,
        TxResultRendering<ContractReceipt>
      >,
      renderTxResults: renderingEvents,
    }),
    [fetch, result, renderingEvents],
  );

  return txStreamResult;
};

const txReceipt = (tx: ContractReceipt): TxReceipt => {
  return {
    name: 'Tx hash',
    value: truncateEvm(tx.transactionHash),
  };
};
