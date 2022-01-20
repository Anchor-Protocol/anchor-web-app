import React from 'react';
import { UIElementProps } from '@libs/ui';
import { TokenBalancesContext } from 'contexts/balances';
import {
  AnchorTokenBalances,
  DefaultAnchorTokenBalances,
} from '@anchor-protocol/app-fns';
import { useEvmNativeBalance } from '../../@libs/app-provider/queries/evm/nativeBalances';
import { useERC20Balance } from '../../@libs/app-provider/queries/erc20/balanceOf';
import { UST, aUST, EVMAddr } from '@anchor-protocol/types';

const EvmTokenBalancesProvider = ({ children }: UIElementProps) => {
  const ethBalance = useEvmNativeBalance();
  // TODO: Implement EVM address provider
  // UST (wh) in ropsten
  const ustBalance = useERC20Balance<UST>(
    '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
  );
  // aUST in ropsten
  const aUstBalance = useERC20Balance<aUST>(
    '0x78D8036EB3Dcb4d8F099E9497d02CDaE202EA358' as EVMAddr,
  );

  const tokenBalances: AnchorTokenBalances = {
    ...DefaultAnchorTokenBalances,
    uUST: ustBalance,
    uEth: ethBalance,
    uaUST: aUstBalance,
  };
  return (
    <TokenBalancesContext.Provider value={tokenBalances}>
      {children}
    </TokenBalancesContext.Provider>
  );
};

export { EvmTokenBalancesProvider };
