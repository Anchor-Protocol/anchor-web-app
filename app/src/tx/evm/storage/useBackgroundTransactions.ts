import { BACKGROUND_TRANSCATION_TAB_ID } from 'components/Header/transactions/BackgroundTransaction';
import { useCallback, useMemo } from 'react';
import { Transaction } from '..';
import { useTransactions } from './useTransactions';

export const useBackgroundTransactions = () => {
  const { transactions, updateTransaction } = useTransactions();

  const backgroundTransactions = useMemo(
    () => transactions.filter((tx) => tx.minimized),
    [transactions],
  );

  const reserveBackgroundTx = useCallback(
    (tx: Transaction) => {
      // can reserve only no-owner tab txes
      if (tx.backgroundTransactionTabId === null) {
        updateTransaction(tx.receipt.transactionHash, {
          backgroundTransactionTabId: BACKGROUND_TRANSCATION_TAB_ID,
        });
      }
    },
    [updateTransaction],
  );

  const unReserveBackgroundTx = useCallback(
    (tx: Transaction) => {
      // only owner tab can unreserve
      if (tx.backgroundTransactionTabId === BACKGROUND_TRANSCATION_TAB_ID) {
        updateTransaction(tx.receipt.transactionHash, {
          backgroundTransactionTabId: null,
        });
      }
    },
    [updateTransaction],
  );

  return {
    backgroundTransactions,
    reserveBackgroundTx,
    unReserveBackgroundTx,
  };
};
