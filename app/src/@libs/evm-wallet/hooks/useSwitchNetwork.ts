import {
  Chain,
  DeploymentTarget,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { chainConfigurations } from '../constants';
import { useEvmWallet } from './useEvmWallet';

export const evmChainId = (chain: Chain) => {
  switch (chain) {
    case Chain.Avalanche:
      return EvmChainId.AVALANCHE;
    default:
      return EvmChainId.ETHEREUM;
  }
};

export const useSwitchNetwork = () => {
  const { updateTarget } = useDeploymentTarget();

  const { provider } = useEvmWallet();

  return useCallback(
    (target: DeploymentTarget) => {
      const targetChainId = target.evmChainId ?? evmChainId(target.chain);

      if (target.isEVM && provider?.provider?.isMetaMask) {
        if (provider?.provider?.request) {
          provider.provider
            .request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ethers.utils.hexValue(targetChainId) }],
            })
            .then(() => {
              updateTarget({ ...target, evmChainId: targetChainId });
            })
            .catch(async (error: Error & { code: number }) => {
              if (error.code === 4902) {
                // 4902 = user attempting to switch to an unrecognized chainId in his wallet
                if (
                  chainConfigurations[targetChainId] &&
                  provider?.provider?.request
                ) {
                  provider.provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [chainConfigurations[targetChainId]],
                  });
                }
              }
            });

          return;
        }
      }

      updateTarget({ ...target, evmChainId: targetChainId });
    },
    [provider, updateTarget],
  );
};
