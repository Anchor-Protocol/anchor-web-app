import React, { createContext, ReactNode, useCallback, useMemo } from 'react';
import { ConnectorData, useConnectors } from '../connectors';
import { Connection, ConnectType, ERC20Token, WalletStatus } from '../types';
import { availableConnectTypes, availableConnections } from '../constants';
import { useLocalStorage } from 'usehooks-ts';

export type EvmWallet = {
  actions: {
    activate: (connectType: ConnectType) => Promise<void>;
    deactivate: () => Promise<void>;
    watchAsset: (token: ERC20Token) => void;
  };
  availableConnectTypes: ConnectType[];
  availableConnections: Connection[];
  connection: Connection | null;
  status: WalletStatus;
  connectType: ConnectType;
} & Omit<ConnectorData, 'isActive' | 'isActivating'>;

export const EvmWalletContext = createContext<EvmWallet | undefined>(undefined);

interface EvmWalletProviderProps {
  children: ReactNode;
}

export function EvmWalletProvider({ children }: EvmWalletProviderProps) {
  const [connectType, setConnectType] = useLocalStorage<ConnectType | null>(
    '__anchor_evm_wallet_connect_type__',
    null,
  );

  const connectors = useConnectors();
  const { data } = connectType ? connectors[connectType] : { data: undefined };
  const address = data ? data.address : undefined;
  const chainId = data ? data.chainId : undefined;
  const error = data ? data.error : undefined;
  const provider = data ? data.provider : undefined;
  const isActivating = data ? data.isActivating : false;
  const isActive = data ? data.isActive : false;
  const status: WalletStatus = isActivating
    ? 'initialization'
    : isActive
    ? 'connected'
    : 'disconnected';

  const activate = useCallback(
    (connectType: ConnectType) => {
      return connectors[connectType].connector
        .activate()
        .then(() => setConnectType(connectType));
    },
    [connectors, setConnectType],
  );

  const deactivate = useCallback(() => {
    setConnectType(null);

    if (connectType) {
      return (
        connectors[connectType].connector.deactivate?.() || Promise.resolve()
      );
    }

    return Promise.resolve();
  }, [connectType, connectors, setConnectType]);

  const evmWallet = useMemo(() => {
    const isConnected =
      connectType && availableConnectTypes.includes(connectType);

    const connection = isConnected
      ? availableConnections.find(({ type }) => type === connectType) || null
      : null;

    const watchAsset = (token: ERC20Token) => {
      provider?.provider?.request &&
        provider.provider
          .request({
            method: 'wallet_watchAsset',
            params: {
              // @ts-ignore ethers has wrong params type (Array<any>)
              type: 'ERC20',
              options: token,
            },
          })
          .catch(console.error);
    };

    return {
      actions: { activate, deactivate, watchAsset },
      connectType: connectType as ConnectType,
      address,
      availableConnectTypes: [...availableConnectTypes],
      availableConnections,
      chainId,
      connection,
      error,
      provider,
      status,
    };
  }, [
    activate,
    address,
    chainId,
    connectType,
    deactivate,
    error,
    provider,
    status,
  ]);

  return (
    <EvmWalletContext.Provider value={evmWallet}>
      {children}
    </EvmWalletContext.Provider>
  );
}
