import {
  Chain,
  DeploymentTarget,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';
import { useCallback } from 'react';
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

  const { actions, connectType } = useEvmWallet();

  const activateEvmWallet = actions?.activate;

  return useCallback(
    async (target: DeploymentTarget) => {
      const targetChainId = target.evmChainId ?? evmChainId(target.chain);

      if (target.isEVM && activateEvmWallet && connectType) {
        await activateEvmWallet(connectType, targetChainId);
      }

      updateTarget({ ...target, evmChainId: targetChainId });
    },
    [activateEvmWallet, connectType, updateTarget],
  );
};
