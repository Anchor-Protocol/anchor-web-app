import React from 'react';
import { UIElementProps } from '@libs/ui';
import { TokenBalancesContext } from 'contexts/balances';
import {
  AnchorTokenBalances,
  DefaultAnchorTokenBalances,
} from '@anchor-protocol/app-fns';
import { u, UST, aUST, Eth } from '@anchor-protocol/types';

const EvmTokenBalancesProvider = ({ children }: UIElementProps) => {
  const tokenBalances: AnchorTokenBalances = {
    ...DefaultAnchorTokenBalances,
    uUST: '12345600' as u<UST>,
    uaUST: '876543' as u<aUST>,
    uEth: '654321' as u<Eth>,
  };
  return (
    <TokenBalancesContext.Provider value={tokenBalances}>
      {children}
    </TokenBalancesContext.Provider>
  );
};

export { EvmTokenBalancesProvider };
