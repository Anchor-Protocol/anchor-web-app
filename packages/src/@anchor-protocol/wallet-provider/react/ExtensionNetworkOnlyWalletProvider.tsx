import {
  ChromeExtensionController,
  StationNetworkInfo,
} from '@terra-dev/chrome-extension';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NetworkInfo, WalletStatus } from '../types';
import { Wallet, WalletContext } from './useWallet';

export interface ExtensionNetworkOnlyWalletProviderProps {
  children: ReactNode;
  defaultNetwork: StationNetworkInfo;
}

export function ExtensionNetworkOnlyWalletProvider({
  children,
  defaultNetwork,
}: ExtensionNetworkOnlyWalletProviderProps) {
  const [controller] = useState<ChromeExtensionController>(
    () =>
      new ChromeExtensionController({
        defaultNetwork,
        enableWalletConnection: false,
      }),
  );

  const [network, setNetwork] = useState<NetworkInfo>(defaultNetwork);

  const post = useCallback(async () => {
    throw new Error(
      `<ExtensionNetworkOnlyWalletProvider> does not support post()`,
    );
  }, []);

  useEffect(() => {
    const networkSubscription = controller.networkInfo().subscribe({
      next: (value) => {
        setNetwork(value);
      },
    });

    return () => {
      networkSubscription.unsubscribe();
    };
  }, [controller]);

  const state = useMemo<Wallet>(() => {
    return {
      availableConnectTypes: [],
      status: WalletStatus.WALLET_NOT_CONNECTED,
      network,
      wallets: [],
      connect: () => {},
      disconnect: () => {},
      post,
      recheckStatus: controller.recheckStatus,
    };
  }, [controller.recheckStatus, network, post]);

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}
