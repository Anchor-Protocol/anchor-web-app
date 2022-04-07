import { useCallback, useEffect } from 'react';
import { ConnectType } from '../types';
import { useWeb3React, getWeb3Connector } from '../providers/Web3ReactProvider';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { getDefaultEvmChainId } from '../hooks/useSwitchEvmNetwork';

export const useNetworkDetection = () => {
  const { chainId, connectionType, connect, disconnect } = useWeb3React();

  const {
    target: { chain },
  } = useDeploymentTarget();

  // determine the destination chain for the deployment target
  const destinationChainId = getDefaultEvmChainId(chain);

  const switchNetwork = useCallback(
    async (type: ConnectType, chainId: number) => {
      // cant use hooks here so we go to the global store
      const [connector, , store] = getWeb3Connector(type);

      disconnect();
      await connector.activate(chainId);

      // the activate method doesnt fail as it reports any
      // errors to its local zustand store so we need
      // to access that to determine if it failed
      const { error } = store.getState();
      if (error === undefined) {
        connect(type);
      }
    },
    [connect, disconnect],
  );

  useEffect(() => {
    if (connectionType !== ConnectType.None && chainId !== destinationChainId) {
      switchNetwork(connectionType, destinationChainId);
    }
  }, [switchNetwork, destinationChainId, chainId, connectionType]);
};
