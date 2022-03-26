import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { BalancesContext } from 'contexts/balances';
import { AnchorBalances } from '@anchor-protocol/app-fns';
import { useEvmNativeBalance } from '../../@libs/app-provider/queries/evm/nativeBalances';
import { useERC20Balance } from '../../@libs/app-provider/queries/erc20/balanceOf';
import { u, UST, aUST, Native, ANC } from '@anchor-protocol/types';
import { useEvmCrossAnchorSdk } from 'crossanchor';

const EvmBalancesProvider = ({ children }: UIElementProps) => {
  const native = useEvmNativeBalance();
  const evmSdk = useEvmCrossAnchorSdk();

  const ust = useERC20Balance<UST>(evmSdk.config.token.UST);

  const aUST = useERC20Balance<aUST>(evmSdk.config.token.aUST);

  const ANC = useERC20Balance<ANC>(evmSdk.config.token.ANC);

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
