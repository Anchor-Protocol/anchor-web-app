import { createContext, useContext } from 'react';
import { IERC20, CrossAnchorBridge } from '@libs/typechain-types';

export interface Contracts {
  crossAnchorBridgeContract: CrossAnchorBridge;
  ustContract: IERC20;
}

export const ContractsContext = createContext<Contracts | undefined>(undefined);

const useContracts = (): Contracts => {
  const context = useContext(ContractsContext);

  if (context === undefined) {
    throw new Error('The ContractsContext has not been defined.');
  }

  return context;
};

export { useContracts };
