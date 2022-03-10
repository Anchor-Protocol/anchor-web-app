import { StreamReturn } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { Subject, Subscription } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { TxEvent, useTx } from './useTx';
import {
  CrossChainEventKind,
  RemoteChainTxExecutedPayload,
} from '@anchor-protocol/crossanchor-sdk';
import { TransactionDisplay, useTransactions } from './storage/useTransactions';
import { useCallback, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { useRefetchQueries } from '@libs/app-provider';
import { EVM_ANCHOR_TX_REFETCH_MAP, refetchQueryByTxKind } from './utils';

type TxRender<TxResult> = TxResultRendering<TxResult>;

export type PersistedTxUtils = {
  minimizeTx: () => void;
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
  ) => Promise<NonNullable<TxResult>>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
  displayTx: (txParams: TxParams) => TransactionDisplay,
  onFinalize: (txHash: string) => void,
  onRegisterTxHash: (txHash: string) => void,
): PersistedTxResult<TxParams, TxResult> => {
  const [txHash, setTxHash] = useState<string>();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);
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
    (txEvent: TxEvent<TxParams>) => {
      const { event, txParams } = txEvent;
      if (Boolean(event.payload)) {
        setTxHash(event.payload!.tx.transactionHash);
        onRegisterTxHash(event.payload!.tx.transactionHash);
      }

      // first event with tx in it
      if (event.kind === CrossChainEventKind.RemoteChainTxExecuted) {
        const payload =
          event.payload as RemoteChainTxExecutedPayload<ContractReceipt>;
        saveTransaction({
          receipt: payload.tx,
          lastEventKind: event.kind,
          minimized: false,
          display: displayTx(txParams),
        });
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
          refetchQueries(refetchQueryByTxKind(displayTx(txParams).txKind));
          const tx = parseTx(resp);
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
    utils: { minimizeTx, isTxMinimizable, dismissTx },
  };
};
