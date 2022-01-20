import React from 'react';
import { UIElementProps } from '@libs/ui';
import { TokenBalancesContext } from 'contexts/balances';
import {
  AnchorTokenBalances,
  DefaultAnchorTokenBalances,
} from '@anchor-protocol/app-fns';
import { useEvmNativeBalance } from '../../@libs/app-provider/queries/evm/nativeBalances';
import { useERC20Balance } from '../../@libs/app-provider/queries/erc20/balanceOf';
import { UST, EVMAddr } from '@anchor-protocol/types';

const EvmTokenBalancesProvider = ({ children }: UIElementProps) => {
  const ethBalance = useEvmNativeBalance();
  // TODO: Implement EVM address provider
  // UST in ropsten
  const ustBalance = useERC20Balance<UST>(
    '0x6ca13a4ab78dd7d657226b155873a04db929a3a4' as EVMAddr,
  );

  const tokenBalances: AnchorTokenBalances = {
    ...DefaultAnchorTokenBalances,
    uUST: ustBalance,
    uEth: ethBalance,
  };
  return (
    <TokenBalancesContext.Provider value={tokenBalances}>
      {children}
    </TokenBalancesContext.Provider>
  );
};

export { EvmTokenBalancesProvider };
