import { useContext } from 'react';

import { EvmWalletContext } from '../providers/EvmWalletProvider';

export function useEvmWallet() {
  const context = useContext(EvmWalletContext);

  if (context === undefined) {
    throw new Error('The EvmWalletContext has not been defined.');
  }

  return context;
}
