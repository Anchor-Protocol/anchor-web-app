import { useContext } from 'react';
import { EvmWalletContext, EvmWallet } from '../providers/EvmWalletProvider';

export function useEvmWallet(): EvmWallet {
  const context = useContext(EvmWalletContext);
  if (context === undefined) {
    return {} as any;
  }
  return context;
}
