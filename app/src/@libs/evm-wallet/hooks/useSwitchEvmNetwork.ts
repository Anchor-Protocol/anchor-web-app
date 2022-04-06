import { Chain } from '@anchor-protocol/app-provider';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';
import { useCallback } from 'react';
import { useEvmWallet } from './useEvmWallet';

export const getDefaultEvmChainId = (chain: Chain) => {
  switch (chain) {
    case Chain.Avalanche:
      return EvmChainId.AVALANCHE;
    default:
      return EvmChainId.ETHEREUM;
  }
};

export const useSwitchEvmNetwork = () => {
  const {
    actions: { activate },
  } = useEvmWallet();

  return useCallback(
    async (chainId: EvmChainId) => {
      if (activate) {
        await activate(chainId);
      }
    },
    [activate],
  );
};
