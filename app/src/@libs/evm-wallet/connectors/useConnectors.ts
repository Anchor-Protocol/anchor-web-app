import { ConnectType } from '../types';
import {
  connector as metaMaskConnector,
  useConnectorData as useMetaMaskConnectorData,
} from './metaMask';
import {
  connector as walletConnectConnector,
  useConnectorData as useWalletConnectConnectorData,
} from './walletConnect';
import { Connector } from './types';

type UseConnectorsReturnType = Record<
  ConnectType,
  Connector<typeof metaMaskConnector | typeof walletConnectConnector>
>;

export function useConnectors(): UseConnectorsReturnType {
  return {
    METAMASK: {
      connector: metaMaskConnector,
      data: useMetaMaskConnectorData(),
    },
    WALLETCONNECT: {
      connector: walletConnectConnector,
      data: useWalletConnectConnectorData(),
    },
  };
}
