import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';
import { supportedChainRpcs } from '../constants';
import { ConnectorData } from './types';

const [connector, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: supportedChainRpcs,
    }),
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
