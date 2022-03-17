import { useMemo } from 'react';
import { useTransactions } from './useTransactions';

export const useTransaction = (txHash: string) => {
  const { transactions } = useTransactions();

  return useMemo(
    () => transactions.find((tx) => tx.txHash === txHash),
    [transactions, txHash],
  );
};
