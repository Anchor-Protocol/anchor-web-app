import { useNetwork } from '@anchor-protocol/app-provider';
import { EvmChainId, EvmSdk } from '@anchor-protocol/crossanchor-sdk';
import { useMemo } from 'react';
import { useEvmWallet } from '@libs/evm-wallet';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

export const useEvmSdk = () => {
  const { lcdClient } = useNetwork();
  const { provider, chainId = EvmChainId.ETHEREUM_ROPSTEN } = useEvmWallet();

  return useMemo(() => {
    return new EvmSdk(
      { chainId },
      lcdClient,
      provider instanceof StaticJsonRpcProvider ? undefined : provider,
      {
        unlimitedAllowance: true,
      },
    );
  }, [chainId, provider, lcdClient]);
};
