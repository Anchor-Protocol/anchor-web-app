import React from 'react';
import { useAnchorBank } from '@anchor-protocol/app-provider';
import { UIElementProps } from '@libs/ui';
import { TokenBalancesContext } from 'contexts/balances';

const TerraTokenBalancesProvider = ({ children }: UIElementProps) => {
  const bank = useAnchorBank();
  return (
    <TokenBalancesContext.Provider value={bank.tokenBalances}>
      {children}
    </TokenBalancesContext.Provider>
  );
};

export { TerraTokenBalancesProvider };
