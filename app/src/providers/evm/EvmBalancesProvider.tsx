import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { BalancesContext } from 'contexts/balances';
import {
  AnchorBalances,
  DefaultAnchorBalances,
} from '@anchor-protocol/app-fns';
import { useEvmNativeBalance } from '../../@libs/app-provider/queries/evm/nativeBalances';
import { useERC20Balance } from '../../@libs/app-provider/queries/erc20/balanceOf';
import { u, UST, aUST, Native, ANC } from '@anchor-protocol/types';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { getAddress } from 'configurations/evm/addresses';

const EvmBalancesProvider = ({ children }: UIElementProps) => {
  const { chainId = EvmChainId.ETHEREUM_ROPSTEN } = useEvmWallet();

  const eth = useEvmNativeBalance();

  const ust = useERC20Balance<UST>(getAddress(chainId, 'UST'));

  const aUST = useERC20Balance<aUST>(getAddress(chainId, 'aUST'));

  const ANC = useERC20Balance<ANC>(getAddress(chainId, 'ANC'));

  const balances = useMemo<AnchorBalances>(() => {
    return {
      ...DefaultAnchorBalances,
      uNative: eth.toString() as u<Native>,
      uUST: ust,
      uaUST: aUST,
      uANC: ANC,
    };
  }, [eth, ust, aUST, ANC]);

  return (
    <BalancesContext.Provider value={balances}>
      {children}
    </BalancesContext.Provider>
  );
};

export { EvmBalancesProvider };
