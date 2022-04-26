import { useNetwork } from '@anchor-protocol/app-provider';
import { Network, TerraSdk } from '@anchor-protocol/crossanchor-sdk';
import { useMemo } from 'react';
import { useConnectedWallet } from '@terra-money/use-wallet';

export const useTerraSdk = () => {
  const connectedWallet = useConnectedWallet();
  const { lcdClient, network } = useNetwork();

  return useMemo(() => {
    if (!connectedWallet || !connectedWallet.availablePost) {
      return undefined;
    }

    return new TerraSdk(network.name as Network, {
      connectedWallet: {
        lcd: lcdClient,
        post: connectedWallet.post,
      },
    });
  }, [connectedWallet, lcdClient, network.name]);
};
