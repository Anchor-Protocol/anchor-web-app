import {
  AnchorBalances,
  DefaultAnchorBalances,
} from '@anchor-protocol/app-fns';
import { createContext, useContext } from 'react';

export const BalancesContext = createContext<AnchorBalances>(
  DefaultAnchorBalances,
);

const useBalances = (): AnchorBalances => {
  const context = useContext(BalancesContext);
  if (context === undefined) {
    throw new Error('The BalancesContext has not been defined.');
  }
  return context;
};

export { useBalances };
