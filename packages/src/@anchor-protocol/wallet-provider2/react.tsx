import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NetworkInfo, WalletStatus } from './models';
import { WalletController, WalletControllerOptions } from './provider';

export interface WalletProviderProps extends WalletControllerOptions {
  children: ReactNode;
}

export enum ConnectType {
  EXTENSION = 'EXTENSION',
  WALLETCONNECT = 'WALLETCONNECT',
}

export interface Wallet {
  status: WalletStatus;
  network: NetworkInfo;
  walletAddress: string | null;
  connect: (type: ConnectType) => void;
  disconnect: () => void;
}

// @ts-ignore
const WalletContext: Context<Wallet> = createContext<Wallet>();

export function WalletProvider({
  children,
  defaultNetwork,
  walletConnectChainIds,
  connectorOpts,
  pushServerOpts,
}: WalletProviderProps) {
  const controller = useRef<WalletController>(
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

  const connect = useCallback((type: ConnectType) => {
    if (type === ConnectType.EXTENSION) {
      controller.current.connectToExtension();
    } else {
      controller.current.connectToWalletConnect();
    }
  }, []);

  const disconnect = useCallback(() => {
    controller.current.disconnect();
  }, []);

  useEffect(() => {
    const statusSubscription = controller.current.status().subscribe({
      next: setStatus,
    });

    const networkSubscription = controller.current.network().subscribe({
      next: setNetwork,
    });

    const walletAddressSubscription = controller.current
      .walletAddress()
      .subscribe({
        next: setWalletAddress,
      });

    return () => {
      statusSubscription.unsubscribe();
      networkSubscription.unsubscribe();
      walletAddressSubscription.unsubscribe();
    };
  }, []);

  const state = useMemo<Wallet>(
    () => ({
      status,
      network,
      walletAddress,
      connect,
      disconnect,
    }),
    [connect, disconnect, network, status, walletAddress],
  );

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): Wallet {
  return useContext(WalletContext);
}

export const WalletConsumer: Consumer<Wallet> = WalletContext.Consumer;
