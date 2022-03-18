import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import {
  NetworkContext,
  TESTNET,
  MAINNET,
} from '@anchor-protocol/app-provider/contexts/network';
import { useEvmWallet, EvmChainId } from '@libs/evm-wallet';

const EvmNetworkProvider = ({ children }: UIElementProps) => {
  const { chainId } = useEvmWallet();

  const network = useMemo(() => {
    if (chainId === undefined) {
      // need to display mainnet information by default
      return MAINNET;
    }
    switch (chainId) {
      case EvmChainId.ETHEREUM:
      case EvmChainId.AVALANCHE:
        return MAINNET;
    }
    return TESTNET;
  }, [chainId]);

  return (
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  );
};

export { EvmNetworkProvider };
