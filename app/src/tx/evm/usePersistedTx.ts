import { StreamReturn } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { TxEvent, useTx } from './useTx';
import { CrossChainEventKind } from '@anchor-protocol/crossanchor-sdk';
import { TransactionDisplay, useTransactions } from './storage/useTransactions';
import { useCallback, useMemo, useState } from 'react';
import { BACKGROUND_TRANSCATION_TAB_ID } from 'components/Header/transactions/BackgroundTransaction';
import { useTransactionSnackbar } from 'components/Header/transactions/background/useTransactionSnackbar';
import { useRefCallback } from 'hooks/useRefCallback';

type TxRender<TxResult> = TxResultRendering<TxResult>;

export type PersistedTxUtils = {
  isTxMinimizable: boolean;
  dismissTx: () => void;
};

export type PersistedTxResult<TxParams, TxResult> = {
  stream: StreamReturn<TxParams, TxRender<TxResult>>;
  utils: PersistedTxUtils;
};

export const usePersistedTx = <TxParams, TxResult>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxRender<TxResult>>,
    txEvents: Subject<TxEvent<TxParams>>,
  ) => Promise<TxResult>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
  displayTx: (txParams: TxParams) => TransactionDisplay,
  onFinalize: (txHash: string) => void,
  onRegisterTxHash: (txHash: string) => void,
  minimized: boolean,
  txHashInput?: string,
): PersistedTxResult<TxParams, TxResult> => {
  const [txHash, setTxHash] = useState<string | undefined>(txHashInput);

  const {
    saveTransaction,
    removeTransaction,
    updateTransaction,
    transactionExists,
  } = useTransactions();

  const { add: addTxSnackbar } = useTransactionSnackbar();

  const isTxMinimizable = useMemo(
    () => transactionExists(txHash),
    [transactionExists, txHash],
  );

  const onTxEvent = useRefCallback(
    (txEvent: TxEvent<TxParams>) => {
      const { event, txParams } = txEvent;
      // first event with tx in it
      if (event.kind === CrossChainEventKind.IncomingTxSubmitted) {
        const payload = event.payload;
        saveTransaction({
          txHash: payload.txHash,
          lastEventKind: event.kind,
          display: displayTx(txParams),
          backgroundTransactionTabId: BACKGROUND_TRANSCATION_TAB_ID,
        });
        setTxHash(payload.txHash);
        onRegisterTxHash(payload.txHash);
        return;
      }

      // update tx for all succeeding events, as txHash is cached
      if (txHash) {
        updateTransaction(txHash, { lastEventKind: event.kind });
      }
    },
    [
      txHash,
      updateTransaction,
      onRegisterTxHash,
      setTxHash,
      displayTx,
      saveTransaction,
    ],
  );

  const dismissTx = useRefCallback(() => {
    if (txHash) {
      removeTransaction(txHash);
      onFinalize(txHash);
    }
  }, [removeTransaction, onFinalize, txHash]);

  const completeTx = useRefCallback(() => {
    if (txHash && minimized) {
      addTxSnackbar(txHash);
    }
  }, [txHash, addTxSnackbar, minimized]);

  const sendTxCallback = useCallback(
    async (
      txParams: TxParams,
      renderTxResults: Subject<TxRender<TxResult>>,
      txEvents: Subject<TxEvent<TxParams>>,
    ) => {
      const txEventsSubscription = txEvents.subscribe(onTxEvent);

      try {
        const resp = await sendTx(txParams, renderTxResults, txEvents);
        if (resp === null) {
          return null;
        }

        completeTx();
        dismissTx();
        return resp;
      } catch (err) {
        dismissTx();
        throw err;
      } finally {
        txEventsSubscription.unsubscribe();
      }
    },
    [sendTx, completeTx, dismissTx, onTxEvent],
  );

  const persistedTxStream = useTx(sendTxCallback, parseTx, emptyTxResult);

  return useMemo(
    () => ({
      stream: persistedTxStream,
      utils: { isTxMinimizable, dismissTx },
    }),
    [persistedTxStream, isTxMinimizable, dismissTx],
  );
};
