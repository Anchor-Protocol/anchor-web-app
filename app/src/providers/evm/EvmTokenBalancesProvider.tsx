import React from 'react';
import { UIElementProps } from '@libs/ui';
import { TokenBalancesContext } from 'contexts/balances';
import {
  AnchorTokenBalances,
  DefaultAnchorTokenBalances,
} from '@anchor-protocol/app-fns';
import { u, UST } from '@anchor-protocol/types';

const EvmTokenBalancesProvider = ({ children }: UIElementProps) => {
  const tokenBalances: AnchorTokenBalances = {
    ...DefaultAnchorTokenBalances,
    uUST: '123456' as u<UST>,
  };
  return (
    <TokenBalancesContext.Provider value={tokenBalances}>
      {children}
    </TokenBalancesContext.Provider>
  );
};

export { EvmTokenBalancesProvider };
