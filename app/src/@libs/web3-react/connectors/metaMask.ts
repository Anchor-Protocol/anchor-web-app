import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';

export const [connector, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask(actions),
);
