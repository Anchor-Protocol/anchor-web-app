import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { ConnectorData } from './types';

const [connector, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask(actions),
);

function useConnectorData(): ConnectorData {
  return {
    address: hooks.useAccount(),
    chainId: hooks.useChainId(),
    error: hooks.useError(),
    isActivating: hooks.useIsActivating(),
    isActive: hooks.useIsActive(),
    provider: hooks.useProvider(),
  };
}

export { connector, useConnectorData };
