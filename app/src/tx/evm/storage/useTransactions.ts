import { CrossChainEventKind } from '@anchor-protocol/crossanchor-sdk';
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { TxKind } from '../utils';

const TRANSACTIONS_STORAGE_KEY = '__anchor_cross_chain_transaction_store';

export type TransactionDisplay = {
  txKind: TxKind;
  amount?: string;
  timestamp: number;
};

export type Transaction = {
  lastEventKind: CrossChainEventKind;
  // TODO: think if this is needed
  // observedEventKinds: CrossChainEventKind[];
  display: TransactionDisplay;
  txHash: string;
  backgroundTransactionTabId: string | null;
};

type TransactionStore = { [key: string]: Transaction };

export const useTransactions = () => {
  const [transactionStore, setTransactionStore] =
    useLocalStorage<TransactionStore>(TRANSACTIONS_STORAGE_KEY, {});

  const getTransaction = useCallback(
    (txHash: string) => transactionStore[txHash],
    [transactionStore],
  );

  const transactionExists = useCallback(
    (txHash: string | undefined) => Boolean(txHash && getTransaction(txHash)),
    [getTransaction],
  );

  const saveTransaction = useCallback(
    (transaction: Transaction) => {
      setTransactionStore((transactionStore) => ({
        ...transactionStore,
        [transaction.txHash]: transaction,
      }));
    },
    [setTransactionStore],
  );

  const updateTransaction = useCallback(
    (txHash: string, updates: Partial<Transaction>) => {
      if (transactionExists(txHash)) {
        const tx = getTransaction(txHash);

        // prevent historic updates
        if (
          updates.lastEventKind &&
          tx.lastEventKind &&
          updates.lastEventKind < tx.lastEventKind
        ) {
          return;
        }

        saveTransaction({ ...tx, ...updates });
      }
    },
    [getTransaction, saveTransaction, transactionExists],
  );

  const removeTransaction = useCallback(
    (transactionHash: string) => {
      setTransactionStore((transactionStore) => {
        const { [transactionHash]: omit, ...rest } = transactionStore;
        return rest;
      });
    },
    [setTransactionStore],
  );

  const removeAll = useCallback(() => {
    setTransactionStore({});
  }, [setTransactionStore]);

  const transactions = useMemo(
    () =>
      Object.values(transactionStore).sort(
        (r1, r2) => r2.display.timestamp - r1.display.timestamp,
      ),
    [transactionStore],
  );

  return {
    transactions,
    saveTransaction,
    getTransaction,
    removeTransaction,
    transactionExists,
    updateTransaction,
    removeAll,
  };
};
