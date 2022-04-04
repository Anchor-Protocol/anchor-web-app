import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';
import { ConnectorData } from './types';

const [connector, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      // rpc: {
      //   1: 'https://rpc.ankr.com/eth',
      //   43113: 'https://api.avax-test.network/ext/bc/C/rpc',
      //   43114: 'https://api.avax.network/ext/bc/C/rpc',
      // },
      infuraId: process.env.INFURA_KEY, // TODO
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
