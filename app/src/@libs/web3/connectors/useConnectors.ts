import { ConnectType } from '../types';
import {
  connector as metaMaskConnector,
  useData as useMetaMaskData,
} from './metaMask';
import {
  connector as walletConnectConnector,
  useData as useWalletConnectData,
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
      data: useMetaMaskData(),
    },
    WALLETCONNECT: {
      connector: walletConnectConnector,
      data: useWalletConnectData(),
    },
  };
}
