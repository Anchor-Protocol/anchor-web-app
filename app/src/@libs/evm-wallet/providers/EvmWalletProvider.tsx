import React, { createContext, useMemo } from 'react';
import { Connection, ConnectType, ERC20Token, WalletStatus } from '../types';
import { AvailableConnections } from '../constants';
import { Web3Provider } from '@ethersproject/providers';
import { UIElementProps } from '@libs/ui';
import { MetaMask } from '@web3-react/metamask';
import { Web3ReactProvider, useWeb3React } from './Web3ReactProvider';
import { useNetworkDetection } from '../hooks/useNetworkDetection';

export type EvmWallet = {
  actions: {
    activate: (chainId?: number) => Promise<void>;
    watchAsset: (token: ERC20Token) => void;
  };
  availableConnectTypes: ConnectType[];
  availableConnections: Connection[];
  connection: Connection | null;
  status: WalletStatus;
  connectType: ConnectType;
  chainId?: number;
  address?: string;
  error?: Error;
  provider: Web3Provider | undefined;
};

export const EvmWalletContext = createContext<EvmWallet | undefined>(undefined);

export function EvmWalletProvider({ children }: UIElementProps) {
  return (
    <Web3ReactProvider>
      <WalletProvider>{children}</WalletProvider>
    </Web3ReactProvider>
  );
}

function WalletProvider({ children }: UIElementProps) {
  const {
    connector,
    chainId,
    isActive,
    isActivating,
    account,
    error,
    provider,
    connectionType,
  } = useWeb3React();

  useNetworkDetection();

  const evmWallet = useMemo<EvmWallet>(() => {
    const status: WalletStatus = isActivating
      ? WalletStatus.Initializing
      : isActive
      ? WalletStatus.Connected
      : WalletStatus.Disconnected;

    const activate = async (chainId?: number) => {
      await connector.activate(chainId);
    };

    const watchAsset = async (token: ERC20Token) => {
      if (connector instanceof MetaMask && connector.provider) {
        await connector.provider?.request({
          method: 'wallet_watchAsset',
          params: {
            // @ts-ignore ethers has wrong params type (Array<any>)
            type: 'ERC20',
            options: token,
          },
        });
      }
    };

    const connection =
      account === undefined
        ? null
        : AvailableConnections.filter((c) => c.type === connectionType)[0];

    return {
      actions: { activate, watchAsset },
      connectType: connectionType,
      availableConnectTypes: [ConnectType.MetaMask, ConnectType.WalletConnect],
      availableConnections: AvailableConnections,
      connection,
      address: account,
      chainId,
      status,
      error,
      provider: provider as Web3Provider,
    };
  }, [
    connectionType,
    connector,
    account,
    isActivating,
    isActive,
    chainId,
    error,
    provider,
  ]);

  return (
    <EvmWalletContext.Provider value={evmWallet}>
      {children}
    </EvmWalletContext.Provider>
  );
}
