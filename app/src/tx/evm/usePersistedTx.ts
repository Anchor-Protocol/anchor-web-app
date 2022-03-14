import { StreamReturn } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { Subject, Subscription } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { TxEvent, useTx } from './useTx';
import {
  CrossChainEventKind,
  RemoteChainTxSubmittedPayload,
} from '@anchor-protocol/crossanchor-sdk';
import { TransactionDisplay, useTransactions } from './storage/useTransactions';
import { useCallback, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { BACKGROUND_TRANSCATION_TAB_ID } from 'components/Header/transactions/BackgroundTransaction';

type TxRender<TxResult> = TxResultRendering<TxResult>;

export type PersistedTxUtils = {
  isTxMinimizable: boolean;
  dismissTx: (txHash?: string) => void;
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
  txHashInput?: string,
): PersistedTxResult<TxParams, TxResult> => {
  const [txHash, setTxHash] = useState<string | undefined>(txHashInput);

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

  const onTxEvent = useCallback(
    (txEvent: TxEvent<TxParams>) => {
      const { event, txParams } = txEvent;
      // first event with tx in it
      if (event.kind === CrossChainEventKind.RemoteChainTxSubmitted) {
        const payload = event.payload as RemoteChainTxSubmittedPayload;
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

  const dismissTx = useCallback(
    (hash?: string) => {
      const h = hash || txHash;
      if (h) {
        removeTransaction(h);
        onFinalize(h);
      }
    },
    [removeTransaction, onFinalize, txHash],
  );

  const [txEvents, setTxEvents] = useState<Subject<TxEvent<TxParams>>>();
  const [subscription, setSubscription] = useState<Subscription>();

  const refreshEventSubscription = useCallback(() => {
    if (txEvents) {
      if (subscription) {
        subscription.unsubscribe();
      }

      const nextSubscription = txEvents.subscribe(onTxEvent);
      setSubscription(nextSubscription);
    }
  }, [txEvents, subscription, setSubscription, onTxEvent]);

  useInterval(refreshEventSubscription, 100);

  return {
    stream: useTx(
      async (
        txParams: TxParams,
        renderTxResults: Subject<TxRender<TxResult>>,
        txEvents: Subject<TxEvent<TxParams>>,
      ) => {
        try {
          setTxEvents(txEvents);
          const resp = await sendTx(txParams, renderTxResults, txEvents);
          if (resp === null) {
            return null;
          }

          const tx = parseTx(resp!);
          dismissTx(tx.transactionHash);
          return resp;
        } catch (err) {
          dismissTx(txHash);
          throw err;
        }
      },
      parseTx,
      emptyTxResult,
    ),
    utils: { isTxMinimizable, dismissTx },
  };
};
