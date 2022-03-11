import { useEvmWallet } from '@libs/evm-wallet';
import React, { useEffect } from 'react';
import { useBackgroundTransactions } from 'tx/evm/storage/useBackgroundTransactions';
import { BackgroundTransaction } from './BackgroundTransaction';
import { useExecuteOnceWhen } from './utils';

export const BackgroundTransactions = () => {
  const { status } = useEvmWallet();
  const { backgroundTransactions, runInBackgroundAll, resetTabIdAll } =
    useBackgroundTransactions();

  useEffect(() => {
    resetTabIdAll();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useExecuteOnceWhen(
    () => setTimeout(() => runInBackgroundAll(), 2000),
    () => status === 'connected',
  );

  return (
    <>
      {status === 'connected' &&
        backgroundTransactions.map((tx) => (
          <BackgroundTransaction key={tx.receipt.transactionHash} tx={tx} />
        ))}
    </>
  );
};
