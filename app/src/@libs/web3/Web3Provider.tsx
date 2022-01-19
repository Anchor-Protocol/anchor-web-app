import { useLocalStorage } from '@libs/use-local-storage';
import React, { createContext, ReactNode, useCallback, useMemo } from 'react';
import { ConnectorData, useConnectors } from './connectors';
import { availableConnections, availableConnectTypes } from './constants';
import { Connection, ConnectType } from './types';

interface Web3ContextValue extends ConnectorData {
  actions: {
    activate: (connectType: ConnectType) => Promise<void>;
    deactivate: () => Promise<void>;
  };
  availableConnections: Connection[];
  connection: Connection | null;
}

export const Web3Context = createContext<Web3ContextValue>(null!);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [connectType, setConnectType] = useLocalStorage<ConnectType | 'null'>(
    '__anchor_wallet_connect_type__',
    () => 'null',
  );

  const isConnected = (availableConnectTypes as ReadonlyArray<string>).includes(
    connectType,
  );

  const connectors = useConnectors();
  const { data } =
    connectType !== 'null' ? connectors[connectType] : { data: null };
  const address = data ? data.address : undefined;
  const chainId = data ? data.chainId : undefined;
  const error = data ? data.error : undefined;
  const isActivating = data ? data.isActivating : false;
  const isActive = data ? data.isActive : false;
  const provider = data ? data.provider : undefined;

  const connection = isConnected
    ? availableConnections.find(({ type }) => type === connectType) || null
    : null;

  const activate = useCallback(
    (connectType: ConnectType) => {
      return connectors[connectType].connector
        .activate()
        .then(() => setConnectType(connectType));
    },
    [connectors, setConnectType],
  );

  const deactivate = useCallback(() => {
    setConnectType('null');

    if (connectType !== 'null') {
      return (
        connectors[connectType].connector.deactivate?.() || Promise.resolve()
      );
    }

    return Promise.resolve();
  }, [connectType, connectors, setConnectType]);

  const contextValue = useMemo(() => {
    return {
      actions: { activate, deactivate },
      address,
      availableConnections,
      chainId,
      connection,
      error,
      isActivating,
      isActive,
      provider,
    };
  }, [
    activate,
    address,
    chainId,
    connection,
    deactivate,
    error,
    isActivating,
    isActive,
    provider,
  ]);

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
}
