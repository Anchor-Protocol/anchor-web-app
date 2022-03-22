import { useNetwork } from '@anchor-protocol/app-provider';
import {
  EvmChainId,
  EvmCrossAnchorSdk,
} from '@anchor-protocol/crossanchor-sdk';
import { useMemo } from 'react';
import { useEvmWallet } from '@libs/evm-wallet';

export const useEvmCrossAnchorSdk = () => {
  const { lcdClient } = useNetwork();
  const { provider, chainId = EvmChainId.ETHEREUM_ROPSTEN } = useEvmWallet();

  return useMemo(() => {
    return new EvmCrossAnchorSdk({ chainId }, lcdClient, provider, {
      unlimitedAllowance: true,
    });
  }, [chainId, provider, lcdClient]);
};
