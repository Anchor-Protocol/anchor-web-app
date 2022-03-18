import { useNetwork } from '@anchor-protocol/app-provider';
import { EvmCrossAnchorSdk } from '@anchor-protocol/crossanchor-sdk';
import { useMemo } from 'react';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { isEvmTestnet } from 'utils/evm';

export const useEvmCrossAnchorSdk = () => {
  const { lcdClient } = useNetwork();

  const { provider, chainId = EvmChainId.ETHEREUM_ROPSTEN } = useEvmWallet();

  return useMemo(() => {
    const network = isEvmTestnet(chainId) ? 'testnet' : 'mainnet';

    return new EvmCrossAnchorSdk(network, lcdClient, provider, {
      unlimitedAllowance: true,
    });
  }, [chainId, provider, lcdClient]);
};
