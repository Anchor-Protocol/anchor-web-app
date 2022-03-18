import React from 'react';
import { UIElementProps } from '@libs/ui';
import { useWallet } from '@terra-money/use-wallet';
import { NetworkContext } from '@anchor-protocol/app-provider/contexts/network';

const TerraNetworkProvider = ({ children }: UIElementProps) => {
  const { network } = useWallet();
  return (
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  );
};

export { TerraNetworkProvider };
