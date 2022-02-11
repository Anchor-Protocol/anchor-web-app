import { HumanAddr } from '@libs/types';
import { createContext, useContext } from 'react';

interface AccountCommon {
  availablePost: boolean;
  readonly: boolean;
}

interface AccountConnected extends AccountCommon {
  chainId: number | string;
  connected: true;
  // connection: {
  //   chainId: number | string;
  //   name: string;
  //   network: 'terra' | 'evm';
  //   type: 'METAMASK' | 'WALLETCONNECT';
  // };
  status: 'connected';
  nativeWalletAddress: HumanAddr;
  terraWalletAddress: HumanAddr;
}

interface AccountDisconnected extends AccountCommon {
  chainId: undefined;
  connected: false;
  // connection: undefined;
  status: 'initialization' | 'disconnected';
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
