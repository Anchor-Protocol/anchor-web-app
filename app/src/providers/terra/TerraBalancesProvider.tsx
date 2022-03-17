import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { BalancesContext } from 'contexts/balances';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { ANC, aUST, Native, u } from '@anchor-protocol/types';
import { useCW20Balance, useTerraNativeBalances } from '@libs/app-provider';
import { useAccount } from 'contexts/account';

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

  const balances = useMemo(() => {
    return {
      uUST,
      uaUST,
      uNative: uLuna.toString() as u<Native>,
      uANC,
    };
  }, [uUST, uLuna, uaUST, uANC]);

  return (
    <BalancesContext.Provider value={balances}>
      {children}
    </BalancesContext.Provider>
  );
};

export { TerraBalancesProvider };
