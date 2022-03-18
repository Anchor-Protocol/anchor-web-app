import { useEvmWallet } from '@libs/evm-wallet';
import React from 'react';
import { useBackgroundTransactions } from 'tx/evm/storage/useBackgroundTransactions';
import { BackgroundTransaction } from './BackgroundTransaction';

export const BackgroundTransactions = () => {
  const { status } = useEvmWallet();
  const { backgroundTransactions } = useBackgroundTransactions();

  return (
    <>
      {status === 'connected' &&
        backgroundTransactions.map((tx) => (
          <BackgroundTransaction key={tx.txHash} tx={tx} />
        ))}
    </>
  );
};
