import { Web3ReactHooks } from '@web3-react/core';

export type ConnectorData = {
  address: ReturnType<Web3ReactHooks['useAccount']>;
  chainId: ReturnType<Web3ReactHooks['useChainId']>;
  error: ReturnType<Web3ReactHooks['useError']>;
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
  isActive: ReturnType<Web3ReactHooks['useIsActive']>;
  provider: ReturnType<Web3ReactHooks['useProvider']>;
};

export interface Connector<T> {
  connector: T;
  data: ConnectorData;
}
