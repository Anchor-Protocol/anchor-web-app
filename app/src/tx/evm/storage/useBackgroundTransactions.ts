import { useCallback, useMemo } from 'react';
import { useTransactions } from './useTransactions';

export const useBackgroundTransactions = () => {
  const { transactions, updateTransaction } = useTransactions();

  const backgroundTransactions = useMemo(
    () => transactions.filter((tx) => tx.minimized),
    [transactions],
  );

  const resetTabIdAll = useCallback(() => {
    transactions.forEach((tx) =>
      updateTransaction(tx.receipt.transactionHash, {
        backgroundTransactionTabId: undefined,
      }),
    );
  }, [transactions, updateTransaction]);

  const runInBackgroundAll = useCallback(() => {
    transactions.forEach((tx) =>
      updateTransaction(tx.receipt.transactionHash, {
        minimized: true,
        backgroundTransactionTabId: undefined,
      }),
    );
  }, [transactions, updateTransaction]);

  return {
    runInBackgroundAll,
    backgroundTransactions,
    resetTabIdAll,
  };
};
