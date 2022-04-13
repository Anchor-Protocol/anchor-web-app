import React, { createContext, useMemo } from 'react';
import { Connection, ConnectType, ERC20Token, WalletStatus } from '../types';
import {
  AvailableConnections,
  SupportedChainIdsByChain,
  SupportedChainName,
  SupportedEvmChain,
} from '../constants';
import { Web3Provider } from '@ethersproject/providers';
import { UIElementProps } from '@libs/ui';
import { MetaMask } from '@web3-react/metamask';
import { Web3ReactProvider, useWeb3React } from './Web3ReactProvider';
import { useCreateReadOnlyWallet } from 'components/dialogs/CreateReadOnlyWallet/evm/useCreateReadOnlyWallet';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';

export interface NetworkInfo {
  name: string;
  chainId: string;
}

export interface ReadonlyWalletSession {
  chainId: string;
  address: string;
}

export type EvmWallet = {
  activate: (chainId?: number) => Promise<Error | undefined>;
  watchAsset: (token: ERC20Token) => void;
  availableConnectTypes: ConnectType[];
  availableConnections: Connection[];
  connection: Connection | null;
  status: WalletStatus;
  connectionType: ConnectType;
  chainId?: number;
  address?: string;
  error?: Error;
  provider: Web3Provider | undefined;
  createReadOnlyWalletSession: () => void;
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
    store,
    chainId,
    isActive,
    isActivating,
    account,
    error,
    provider,
    connectionType,
  } = useWeb3React();

  const {
    target: { chain },
  } = useDeploymentTarget();

  const [requestReadOnlyWalletCreationFlow, createReadOnlyWalletDialog] =
    useCreateReadOnlyWallet();

  const evmWallet = useMemo<EvmWallet>(() => {
    const status: WalletStatus = isActivating
      ? WalletStatus.Initializing
      : isActive
      ? WalletStatus.Connected
      : WalletStatus.Disconnected;

    const activate = async (chainId?: number): Promise<Error | undefined> => {
      await connector.activate(chainId);

      // the activate method doesnt fail as it reports any
      // errors to its local zustand store so we need
      // to access that to determine if it failed
      const { error } = store.getState();

      return error;
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

    const createReadOnlyWalletSession = async () => {
      // TODO: provide networks
      const supportedChainIds =
        SupportedChainIdsByChain[chain as SupportedEvmChain];
      const networks = supportedChainIds.map((chainId) => ({
        chainId: chainId.toString(),
        name: SupportedChainName[chainId],
      }));
      const readonlyWallet = await requestReadOnlyWalletCreationFlow(networks);

      if (readonlyWallet !== null) {
        // TODO: connect readonly wallet
        console.log(readonlyWallet);
      }
    };

    const connection =
      account === undefined
        ? null
        : AvailableConnections.filter((c) => c.type === connectionType)[0];

    return {
      activate,
      watchAsset,
      connectionType,
      availableConnectTypes: [
        ConnectType.MetaMask,
        ConnectType.WalletConnect,
        ConnectType.ReadOnly,
      ],
      availableConnections: AvailableConnections,
      connection,
      address: account,
      chainId,
      status,
      error,
      provider: provider as Web3Provider,
      createReadOnlyWalletSession,
    };
  }, [
    isActivating,
    isActive,
    account,
    connectionType,
    chainId,
    error,
    provider,
    connector,
    store,
    chain,
    requestReadOnlyWalletCreationFlow,
  ]);

  return (
    <EvmWalletContext.Provider value={evmWallet}>
      {children}
      {createReadOnlyWalletDialog}
    </EvmWalletContext.Provider>
  );
}
