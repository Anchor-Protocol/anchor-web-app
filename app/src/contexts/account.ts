import { HumanAddr } from '@libs/types';
import { createContext, useContext } from 'react';

interface AccountCommon {
  availablePost: boolean;
  readonly: boolean;
  network: 'terra' | 'evm';
  status: 'initialization' | 'connected' | 'disconnected';
  // TODO
  // connect: (connectType: 'extension' | 'walletconnect' | 'readonly') => void;
  // disconnect: () => void;
}

interface AccountConnected extends AccountCommon {
  connected: true;
  nativeWalletAddress: HumanAddr;
  terraWalletAddress: HumanAddr;
}

interface AccountDisconnected extends AccountCommon {
  connected: false;
  nativeWalletAddress: undefined;
  terraWalletAddress: undefined;
}

export type Account = AccountConnected | AccountDisconnected;

export const AccountContext = createContext<Account | undefined>(undefined);

const useAccount = (): Account => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('The AccountContext has not been defined.');
  }
  return context;
};

export { useAccount };
