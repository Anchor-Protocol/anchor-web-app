import { AnchorTokenBalances } from '@anchor-protocol/app-fns';
import { createContext, useContext } from 'react';

export const TokenBalancesContext = createContext<
  AnchorTokenBalances | undefined
>(undefined);

const useTokenBalances = (): AnchorTokenBalances => {
  const context = useContext(TokenBalancesContext);
  if (context === undefined) {
    throw new Error('The TokenBalancesContext has not been defined.');
  }
  return context;
};

export { useTokenBalances };
