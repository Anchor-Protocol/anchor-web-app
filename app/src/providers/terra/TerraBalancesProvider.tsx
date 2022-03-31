import React, { useCallback, useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { BalancesContext } from 'contexts/balances';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { ANC, aUST, CollateralAmount, Native, u } from '@anchor-protocol/types';
import { useCW20Balance, useTerraNativeBalances } from '@libs/app-provider';
import { useAccount } from 'contexts/account';
import Big from 'big.js';
import { WhitelistCollateral } from 'queries';

const TerraBalancesProvider = ({ children }: UIElementProps) => {
  const { contractAddress } = useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  const { uUST, uLuna } = useTerraNativeBalances(terraWalletAddress);

  const uaUST = useCW20Balance<aUST>(
    contractAddress.cw20.aUST,
    terraWalletAddress,
  );

  const uANC = useCW20Balance<ANC>(
    contractAddress.cw20.ANC,
    terraWalletAddress,
  );

  const fetchWalletBalance = useCallback(
    (collateral?: WhitelistCollateral) => {
      // TODO: this isnt used anywhere yet
      if (collateral === undefined || terraWalletAddress === undefined) {
        return Promise.resolve(Big(0) as u<CollateralAmount<Big>>);
      }
      return Promise.resolve(Big(0) as u<CollateralAmount<Big>>);
    },
    [terraWalletAddress],
  );

  const balances = useMemo(() => {
    return {
      uUST,
      uaUST,
      uNative: uLuna.toString() as u<Native>,
      uANC,
      fetchWalletBalance,
    };
  }, [uUST, uLuna, uaUST, uANC, fetchWalletBalance]);

  return (
    <BalancesContext.Provider value={balances}>
      {children}
    </BalancesContext.Provider>
  );
};

export { TerraBalancesProvider };
