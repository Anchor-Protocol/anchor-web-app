import { useNetwork } from '@anchor-protocol/app-provider';
import { Network, TerraSdk } from '@anchor-protocol/crossanchor-sdk';
import { useMemo } from 'react';
import { useConnectedWallet } from '@terra-money/use-wallet';

export const useTerraSdk = () => {
  const connectedWallet = useConnectedWallet();
  const { lcdClient, network } = useNetwork();

  return useMemo(() => {
    const postAvailable =
      connectedWallet && connectedWallet.availablePost && connectedWallet.post;

    return new TerraSdk(network.name as Network, {
      connectedWallet: {
        lcd: lcdClient,
        post: postAvailable ? connectedWallet.post : undefined,
      },
    });
  }, [connectedWallet, lcdClient, network.name]);
};
