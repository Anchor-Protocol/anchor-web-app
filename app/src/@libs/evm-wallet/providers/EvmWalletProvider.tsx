import { useLocalStorage } from '@libs/use-local-storage';
import React, { createContext, ReactNode, useCallback, useMemo } from 'react';
import { ConnectorData, useConnectors } from '../connectors';
import { Connection, ConnectType, WalletStatus } from '../types';
import { availableConnectTypes, availableConnections } from '../constants';

export type EvmWallet = {
  actions: {
    activate: (connectType: ConnectType) => Promise<void>;
    deactivate: () => Promise<void>;
  };
  availableConnectTypes: ConnectType[];
  availableConnections: Connection[];
  connection: Connection | null;
  status: WalletStatus;
  connectType: ConnectType;
} & Omit<ConnectorData, 'isActive' | 'isActivating'>;

export const EvmWalletContext = createContext<EvmWallet | undefined>(undefined);

export function EvmWalletProvider({ children }: { children: ReactNode }) {
  const [connectType, setConnectType] = useLocalStorage<ConnectType | 'null'>(
    '__anchor_evm_wallet_connect_type__',
    () => 'null',
  );

  const connectors = useConnectors();
  const { data } =
    connectType !== 'null' ? connectors[connectType] : { data: undefined };
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
    setConnectType('null');

    if (connectType !== 'null') {
      return (
        connectors[connectType].connector.deactivate?.() || Promise.resolve()
      );
    }

    return Promise.resolve();
  }, [connectType, connectors, setConnectType]);

  const evmWallet = useMemo(() => {
    const isConnected = (
      availableConnectTypes as ReadonlyArray<string>
    ).includes(connectType);

    const connection = isConnected
      ? availableConnections.find(({ type }) => type === connectType) || null
      : null;

    return {
      actions: { activate, deactivate },
      connectType,
      address,
      availableConnectTypes: availableConnectTypes as unknown as ConnectType[], // TODO
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
