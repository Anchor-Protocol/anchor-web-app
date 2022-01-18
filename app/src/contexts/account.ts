import { HumanAddr } from '@libs/types';
import { createContext, useContext } from 'react';

export interface Account {
  nativeWalletAddress?: HumanAddr;
  terraWalletAddress?: HumanAddr;
  connected: boolean;
  readonly: boolean;
}

export const AccountContext = createContext<Account | undefined>(undefined);

const useAccount = (): Account => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('The AccountContext has not been defined.');
  }
  return context;
};

export { useAccount };
