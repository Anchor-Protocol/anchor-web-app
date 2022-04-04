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

  const {
    actions: { activate },
    connectType,
  } = useEvmWallet();

  return useCallback(
    async (target: DeploymentTarget) => {
      const targetChainId = target.evmChainId ?? evmChainId(target.chain);

      if (target.isEVM) {
        await activate(connectType, targetChainId);
      }

      updateTarget({ ...target, evmChainId: targetChainId });
    },
    [activate, connectType, updateTarget],
  );
};
