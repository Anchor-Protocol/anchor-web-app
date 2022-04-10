import React, { useCallback, useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { BalancesContext } from 'contexts/balances';
import { AnchorBalances } from '@anchor-protocol/app-fns';
import { useEvmNativeBalance } from '../../@libs/app-provider/queries/evm/nativeBalances';
import { useERC20Balance } from '../../@libs/app-provider/queries/erc20/balanceOf';
import {
  u,
  UST,
  aUST,
  Native,
  ANC,
  CollateralAmount,
} from '@anchor-protocol/types';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import Big from 'big.js';
import { WhitelistCollateral } from 'queries';
import { useAccount } from 'contexts/account';

const EvmBalancesProvider = ({ children }: UIElementProps) => {
  const { nativeWalletAddress: walletAddress } = useAccount();
  const native = useEvmNativeBalance();
  const evmSdk = useEvmCrossAnchorSdk();

  const ust = useERC20Balance<UST>(evmSdk.config.token.UST);

  const aUST = useERC20Balance<aUST>(evmSdk.config.token.aUST);

  const ANC = useERC20Balance<ANC>(evmSdk.config.token.ANC);

  const fetchWalletBalance = useCallback(
    (collateral?: WhitelistCollateral) => {
      if (collateral === undefined || walletAddress === undefined) {
        return Promise.resolve(Big(0) as u<CollateralAmount<Big>>);
      }
      return evmSdk.fetchWalletBalance(walletAddress, collateral);
    },
    [evmSdk, walletAddress],
  );

  const balances = useMemo<AnchorBalances>(() => {
    return {
      uNative: native.toString() as u<Native>,
      uUST: ust,
      uaUST: aUST,
      uANC: ANC,
      fetchWalletBalance,
    };
  }, [native, ust, aUST, ANC, fetchWalletBalance]);

  return (
    <BalancesContext.Provider value={balances}>
      {children}
    </BalancesContext.Provider>
  );
};

export { EvmBalancesProvider };
