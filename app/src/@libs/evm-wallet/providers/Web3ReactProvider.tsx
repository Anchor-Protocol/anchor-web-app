import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { getSelectedConnector, Web3ReactHooks } from '@web3-react/core';
import type { Connector } from '@web3-react/types';
import { Empty } from '@web3-react/empty';
import type { BaseProvider, Web3Provider } from '@ethersproject/providers';
import { getConnectionType } from '../utils';
import { ConnectType } from '../types';
import { useLocalStorage } from 'usehooks-ts';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask';
import {
  hooks as walletConnectHooks,
  walletConnect,
} from '../connectors/walletConnect';
import { hooks as emptyHooks, empty } from '../connectors/empty';

const connectors: [Empty | MetaMask | WalletConnect, Web3ReactHooks][] = [
  [empty, emptyHooks],
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
];

type Web3ContextType = {
  chainId: ReturnType<Web3ReactHooks['useChainId']>;
  accounts: ReturnType<Web3ReactHooks['useAccounts']>;
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
  error: ReturnType<Web3ReactHooks['useError']>;
  account: ReturnType<Web3ReactHooks['useAccount']>;
  isActive: ReturnType<Web3ReactHooks['useIsActive']>;
  provider: ReturnType<Web3ReactHooks['useProvider']>;
  connector: Connector;
  connectionType: ConnectType;
  connect: (connectionType: ConnectType) => void;
  disconnect: () => void;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ReactProviderProps {
  children: ReactNode;
}

export function Web3ReactProvider<T extends BaseProvider = Web3Provider>(
  props: Web3ReactProviderProps,
) {
  const { children } = props;

  const [connectionType, setConnectionType] = useLocalStorage<ConnectType>(
    '__anchor_evm_wallet_connect_type__',
    ConnectType.None,
  );

  const {
    useSelectedChainId,
    useSelectedAccounts,
    useSelectedIsActivating,
    useSelectedError,
    useSelectedAccount,
    useSelectedIsActive,
    useSelectedProvider,
  } = getSelectedConnector(...connectors);

  const connector = useMemo<Connector>(() => {
    const found = connectors.find(
      (c) => getConnectionType(c[0]) === (connectionType ?? ConnectType.None),
    );
    return found![0];
  }, [connectionType]);

  useEffect(() => {
    if (connector && connector.connectEagerly) {
      void connector.connectEagerly();
    }
  }, [connector]);

  const chainId = useSelectedChainId(connector);
  const accounts = useSelectedAccounts(connector);
  const isActivating = useSelectedIsActivating(connector);
  const error = useSelectedError(connector);
  const account = useSelectedAccount(connector);
  const isActive = useSelectedIsActive(connector);
  const provider = useSelectedProvider<T>(connector, 'any');

  const value = useMemo(() => {
    const connect = (connectionType: ConnectType) =>
      setConnectionType(connectionType);

    const disconnect = () => setConnectionType(ConnectType.None);

    return {
      chainId,
      accounts,
      isActivating,
      error,
      account,
      isActive,
      provider,
      connector,
      connectionType: connectionType ?? ConnectType.None,
      connect,
      disconnect,
    };
  }, [
    chainId,
    accounts,
    isActivating,
    error,
    account,
    isActive,
    provider,
    connector,
    connectionType,
    setConnectionType,
  ]);

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3React() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw Error('The Web3Context has not been defined.');
  }
  return context;
}
