import { CreateTxOptions } from '@terra-money/terra.js';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { WalletController, WalletControllerOptions } from '../controller';
import { NetworkInfo, WalletStatus } from '../models';
import { ConnectType, Wallet, WalletContext } from './useWallet';

export interface WalletProviderProps extends WalletControllerOptions {
  children: ReactNode;
}

export function WalletProvider({
  children,
  defaultNetwork,
  walletConnectChainIds,
  connectorOpts,
  pushServerOpts,
}: WalletProviderProps) {
  const [controller] = useState<WalletController>(
    () =>
      new WalletController({
        defaultNetwork,
        walletConnectChainIds,
        connectorOpts,
        pushServerOpts,
      }),
  );

  const [status, setStatus] = useState<WalletStatus>(WalletStatus.INITIALIZING);
  const [network, setNetwork] = useState<NetworkInfo>(defaultNetwork);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [availableExtension, setAvailableExtension] = useState<boolean>(false);

  const connect = useCallback(
    (type: ConnectType) => {
      if (type === ConnectType.EXTENSION) {
        controller.connectToExtension();
      } else {
        controller.connectToWalletConnect();
      }
    },
    [controller],
  );

  const disconnect = useCallback(() => {
    controller.disconnect();
  }, [controller]);

  const recheckExtensionStatus = useCallback(() => {
    controller.recheckExtensionStatus();
  }, [controller]);

  const post = useCallback(
    async (tx: CreateTxOptions) => {
      return controller.post(tx);
    },
    [controller],
  );

  useEffect(() => {
    const statusSubscription = controller.status().subscribe({
      next: (value) => {
        setStatus(value);
      },
    });

    const networkSubscription = controller.network().subscribe({
      next: (value) => {
        setNetwork(value);
      },
    });

    const walletAddressSubscription = controller.walletAddress().subscribe({
      next: (value) => {
        setWalletAddress(value);
      },
    });

    setAvailableExtension(controller.availableExtension() === true);

    return () => {
      statusSubscription.unsubscribe();
      networkSubscription.unsubscribe();
      walletAddressSubscription.unsubscribe();
    };
  }, [controller]);

  const state = useMemo<Wallet>(() => {
    return {
      status,
      network,
      walletAddress,
      connect,
      disconnect,
      recheckExtensionStatus,
      post,
      availableExtension,
    };
  }, [
    availableExtension,
    connect,
    disconnect,
    network,
    post,
    recheckExtensionStatus,
    status,
    walletAddress,
  ]);

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}
