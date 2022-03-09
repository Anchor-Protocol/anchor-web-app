import { StreamReturn } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { TxEventHandler, useTx } from './useTx';
import {
  CrossChainEvent,
  CrossChainEventKind,
  RemoteChainTxExecutedPayload,
} from '@anchor-protocol/crossanchor-sdk';
import { TransactionDisplay, useTransactions } from './storage/useTransactions';
import { useCallback, useMemo, useState } from 'react';

type TxRender<TxResult> = TxResultRendering<TxResult>;

export type PersistedTxUtils = {
  minimizeTx: () => void;
  isTxMinimizable: boolean;
};

export type PersistedTxResult<TxParams, TxResult> = {
  stream: StreamReturn<TxParams, TxRender<TxResult>>;
  utils: PersistedTxUtils;
};

export const usePersistedTx = <TxParams, TxResult>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxRender<TxResult>>,
    handleEvent: TxEventHandler<TxParams>,
  ) => Promise<NonNullable<TxResult>>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
  displayTx: (txParams: TxParams) => TransactionDisplay,
): PersistedTxResult<TxParams, TxResult> => {
  const [txHash, setTxHash] = useState<string>();
  const {
    saveTransaction,
    removeTransaction,
    updateTransaction,
    transactionExists,
  } = useTransactions();

  const isTxMinimizable = useMemo(
    () => transactionExists(txHash),
    [transactionExists, txHash],
  );

  const minimizeTx = useCallback(() => {
    if (isTxMinimizable) {
      updateTransaction(txHash!, { minimized: true });
    }
  }, [updateTransaction, isTxMinimizable, txHash]);

  const onTxEvent = useCallback(
    (event: CrossChainEvent<ContractReceipt>, txParams: TxParams) => {
      if (event.payload) {
        setTxHash(event.payload.tx.transactionHash);
      }

      // first event with tx in it
      if (event.kind === CrossChainEventKind.RemoteChainTxExecuted) {
        const payload =
          event.payload as RemoteChainTxExecutedPayload<ContractReceipt>;
        saveTransaction({
          running: true,
          receipt: payload.tx,
          lastEventKind: event.kind,
          minimized: false,
          display: displayTx(txParams),
        });
        return;
      }

      // update tx for all succeeding events, as txHash is cached
      updateTransaction(txHash!, { lastEventKind: event.kind });
    },
    [saveTransaction, displayTx, updateTransaction, setTxHash, txHash],
  );

  return {
    stream: useTx(
      async (
        txParams: TxParams,
        renderTxResults: Subject<TxRender<TxResult>>,
        handleEvent: TxEventHandler<TxParams>,
      ) => {
        try {
          const resp = await sendTx(txParams, renderTxResults, handleEvent);
          const tx = parseTx(resp);
          removeTransaction(tx.transactionHash);
          return resp;
        } catch (err) {
          if (txHash) {
            removeTransaction(txHash);
          }
          throw err;
        }
      },
      parseTx,
      emptyTxResult,
      onTxEvent,
    ),
    utils: { minimizeTx, isTxMinimizable },
  };
};
