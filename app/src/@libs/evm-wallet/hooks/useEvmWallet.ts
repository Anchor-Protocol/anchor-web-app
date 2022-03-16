import { useContext } from 'react';
import { EvmWalletContext, EvmWallet } from '../providers/EvmWalletProvider';

export function useEvmWallet(): EvmWallet {
  const context = useContext(EvmWalletContext);
  if (context === undefined) {
    throw new Error('The EvmWalletContext has not been defined.');
  }
  return context;
}
