import React from 'react';
import { UIElementProps } from '@libs/ui';
import { NetworkContext } from '@anchor-protocol/app-provider/contexts/network';
import { useWallet } from '@terra-money/wallet-provider';

const TerraNetworkProvider = ({ children }: UIElementProps) => {
  const { network } = useWallet();

  console.log('TerraNetworkProvider:', network);

  return (
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  );
};

export { TerraNetworkProvider };
