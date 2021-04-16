import { WalletController } from '../controller';
import { StationNetworkInfo } from '@terra-dev/extension';
import { CreateTxOptions } from '@terra-money/terra.js';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NetworkInfo, WalletStatus } from '../models';
import { Wallet, WalletContext } from './useWallet';

export function ExtensionNetworkOnlyWalletProvider({
  children,
  defaultNetwork,
}: {
  children: ReactNode;
  defaultNetwork: StationNetworkInfo;
}) {
  const [controller] = useState<WalletController>(
    () =>
      new WalletController({
        defaultNetwork,
        walletConnectChainIds: new Map(),
      }),
  );

  const [network, setNetwork] = useState<NetworkInfo>(defaultNetwork);

  const [availableExtension, setAvailableExtension] = useState<boolean>(false);

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
    const networkSubscription = controller.network().subscribe({
      next: (value) => {
        setNetwork(value);
      },
    });

    setAvailableExtension(controller.availableExtension() === true);

    return () => {
      networkSubscription.unsubscribe();
    };
  }, [controller]);

  useEffect(() => {
    if (availableExtension) {
      controller.enableExtension();
    }
  }, [availableExtension, controller]);

  const state = useMemo<Wallet>(() => {
    return {
      status: WalletStatus.WALLET_NOT_CONNECTED,
      network,
      walletAddress: null,
      connect: () => {},
      disconnect: () => {},
      recheckExtensionStatus,
      post,
      availableExtension,
    };
  }, [availableExtension, network, post, recheckExtensionStatus]);

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}
