import { useCallback, useMemo } from 'react';
import { useTransactions } from './useTransactions';

export const useBackgroundTransactions = () => {
  const { transactions, updateTransaction } = useTransactions();

  const backgroundTransactions = useMemo(
    () => transactions.filter((tx) => tx.minimized),
    [transactions],
  );

  const runInBackgroundAll = useCallback(() => {
    transactions.forEach((tx) =>
      updateTransaction(tx.receipt.transactionHash, {
        minimized: true,
      }),
    );
  }, [transactions, updateTransaction]);

  return {
    runInBackgroundAll,
    backgroundTransactions,
  };
};
