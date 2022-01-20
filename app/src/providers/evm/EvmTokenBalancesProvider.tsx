import React from 'react';
import { UIElementProps } from '@libs/ui';
import { BalancesContext } from 'contexts/balances';
import {
  AnchorBalances,
  DefaultAnchorTokenBalances,
} from '@anchor-protocol/app-fns';
import { u, UST, Native } from '@anchor-protocol/types';

const EvmTokenBalancesProvider = ({ children }: UIElementProps) => {
  const tokenBalances: AnchorBalances = {
    ...DefaultAnchorTokenBalances,
    uUST: '123456' as u<UST>,
    uNative: '123456' as u<Native>
  };
  return (
    <BalancesContext.Provider value={tokenBalances}>
      {children}
    </BalancesContext.Provider>
  );
};

export { EvmTokenBalancesProvider };
