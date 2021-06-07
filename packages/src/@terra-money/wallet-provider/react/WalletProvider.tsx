import { NetworkInfo } from '@terra-dev/wallet-types';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { WalletController, WalletControllerOptions } from '../controller';
import { ConnectType, WalletInfo, WalletStatus } from '../types';
import { Wallet, WalletContext } from './useWallet';

export interface WalletProviderProps extends WalletControllerOptions {
  children: ReactNode;
}

export function WalletProvider({
  children,
  defaultNetwork,
  walletConnectChainIds,
  connectorOpts,
  pushServerOpts,
  createReadonlyWalletSession,
  waitingChromeExtensionInstallCheck,
}: WalletProviderProps) {
  const [controller] = useState<WalletController>(
    () =>
      new WalletController({
        defaultNetwork,
        walletConnectChainIds,
        connectorOpts,
        pushServerOpts,
        createReadonlyWalletSession,
        waitingChromeExtensionInstallCheck,
      }),
  );

  const [availableConnectTypes, setAvailableConnectTypes] = useState<
    ConnectType[]
  >(() => []);
  const [availableInstallTypes, setAvailableInstallTypes] = useState<
    ConnectType[]
  >(() => []);
  const [status, setStatus] = useState<WalletStatus>(WalletStatus.INITIALIZING);
  const [network, setNetwork] = useState<NetworkInfo>(defaultNetwork);
  const [wallets, setWallets] = useState<WalletInfo[]>(() => []);

  useEffect(() => {
    const availableConnectTypesSubscription = controller
      .availableConnectTypes()
      .subscribe({
        next: (value) => {
          setAvailableConnectTypes(value);
        },
      });

    const availableInstallTypesSubscription = controller
      .availableInstallTypes()
      .subscribe({
        next: (value) => {
          setAvailableInstallTypes(value);
        },
      });

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

    const walletsSubscription = controller.wallets().subscribe({
      next: (value) => {
        setWallets(value);
      },
    });

    return () => {
      availableConnectTypesSubscription.unsubscribe();
      availableInstallTypesSubscription.unsubscribe();
      statusSubscription.unsubscribe();
      networkSubscription.unsubscribe();
      walletsSubscription.unsubscribe();
    };
  }, [controller]);

  const state = useMemo<Wallet>(() => {
    return {
      availableConnectTypes,
      availableInstallTypes,
      status,
      network,
      wallets,
      install: controller.install,
      connect: controller.connect,
      connectReadonly: controller.connectReadonly,
      disconnect: controller.disconnect,
      post: controller.post,
      recheckStatus: controller.recheckStatus,
    };
  }, [
    availableConnectTypes,
    availableInstallTypes,
    controller.connect,
    controller.connectReadonly,
    controller.disconnect,
    controller.install,
    controller.post,
    controller.recheckStatus,
    network,
    status,
    wallets,
  ]);

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}
