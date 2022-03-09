import React, { useEffect } from 'react';
import { useTransactions } from 'tx/evm/storage/useTransactions';
import { BackgroundTransaction } from './BackgroundTransaction';

export const BackgroundTransactions = () => {
  const { minimizedTransactions, minimizeAndStopAll } = useTransactions();

  useEffect(() => {
    minimizeAndStopAll();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {minimizedTransactions.map((tx) => (
        <BackgroundTransaction key={tx.receipt.transactionHash} tx={tx} />
      ))}
    </>
  );
};
