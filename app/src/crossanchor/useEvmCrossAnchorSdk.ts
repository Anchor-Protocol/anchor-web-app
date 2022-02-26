import { useNetwork } from '@anchor-protocol/app-provider';
import { EvmCrossAnchorSdk } from '@anchor-protocol/crossanchor-sdk';
import { LCDClient } from '@terra-money/terra.js';
import { useMemo } from 'react';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { isEvmTestnet } from 'utils/evm';

export const useEvmCrossAnchorSdk = () => {
  const terra = useNetwork();

  const { provider, chainId = EvmChainId.ETHEREUM_ROPSTEN } = useEvmWallet();

  const lcd = useMemo(() => {
    return new LCDClient({
      chainID: terra.chainID,
      URL: terra.lcd,
    });
  }, [terra.chainID, terra.lcd]);

  return useMemo(() => {
    const network = isEvmTestnet(chainId) ? 'testnet' : 'mainnet';

    return new EvmCrossAnchorSdk(network, lcd, provider, {
      skipRedemption: false,
      unlimitedAllowance: false,
    });
  }, [chainId, provider, lcd]);
};
