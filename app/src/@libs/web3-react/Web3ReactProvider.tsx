import type { Web3ReactHooks } from '@web3-react/core';
import React, { ReactNode, createContext } from 'react';
import { MetaMask } from '@web3-react/metamask';
import { connector, hooks } from './connectors/metaMask';

const contextValue = { connector, hooks };

export const Web3ReactContext = createContext<{
  connector: MetaMask;
  hooks: Web3ReactHooks;
}>(contextValue);

export function Web3ReactProvider({ children }: { children: ReactNode }) {
  return (
    <Web3ReactContext.Provider value={contextValue}>
      {children}
    </Web3ReactContext.Provider>
  );
}
