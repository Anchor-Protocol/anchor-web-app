import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { BalancesContext } from 'contexts/balances';
import { AnchorBalances } from '@anchor-protocol/app-fns';
import { useEvmNativeBalance } from '../../@libs/app-provider/queries/evm/nativeBalances';
import { useERC20Balance } from '../../@libs/app-provider/queries/erc20/balanceOf';
import { u, UST, aUST, Native, ANC, ERC20Addr } from '@anchor-protocol/types';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { getAddress } from 'configurations/evm/addresses';

const EvmBalancesProvider = ({ children }: UIElementProps) => {
  const { chainId = EvmChainId.ETHEREUM_ROPSTEN } = useEvmWallet();

  const native = useEvmNativeBalance();

  const ust = useERC20Balance<UST>(getAddress<ERC20Addr>(chainId, 'UST'));

  const aUST = useERC20Balance<aUST>(getAddress<ERC20Addr>(chainId, 'aUST'));

  const ANC = useERC20Balance<ANC>(getAddress<ERC20Addr>(chainId, 'ANC'));

  const balances = useMemo<AnchorBalances>(() => {
    return {
      uNative: native.toString() as u<Native>,
      uUST: ust,
      uaUST: aUST,
      uANC: ANC,
    };
  }, [native, ust, aUST, ANC]);

  return (
    <BalancesContext.Provider value={balances}>
      {children}
    </BalancesContext.Provider>
  );
};

export { EvmBalancesProvider };
