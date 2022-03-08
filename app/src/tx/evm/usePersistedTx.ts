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
  isTxPersisted: boolean;
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

  const isTxPersisted = useMemo(
    () => transactionExists(txHash),
    [transactionExists, txHash],
  );
  const minimizeTx = useCallback(() => {
    if (isTxPersisted) {
      updateTransaction(txHash!, { minimized: true });
    }
  }, [updateTransaction, isTxPersisted, txHash]);

  const onTxEvent = useCallback(
    (event: CrossChainEvent<ContractReceipt>, txParams: TxParams) => {
      // first event with tx in it
      // TODO: check if it can be returned earlier
      if (event.kind === CrossChainEventKind.RemoteChainTxExecuted) {
        const payload =
          event.payload as RemoteChainTxExecutedPayload<ContractReceipt>;
        if (!Boolean(txHash)) {
          setTxHash(payload.tx.transactionHash);
          saveTransaction({
            receipt: payload.tx,
            lastEventKind: event.kind,
            minimized: false,
            display: displayTx(txParams),
          });
        }
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
        const resp = await sendTx(txParams, renderTxResults, handleEvent);
        const tx = parseTx(resp);
        removeTransaction(tx.transactionHash);
        return resp;
      },
      parseTx,
      emptyTxResult,
      onTxEvent,
    ),
    utils: { minimizeTx, isTxPersisted },
  };
};
