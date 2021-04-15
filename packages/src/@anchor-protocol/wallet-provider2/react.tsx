import { HumanAddr } from '@anchor-protocol/types';
import { useInterval } from '@terra-dev/use-interval';
import { AccAddress, CreateTxOptions } from '@terra-money/terra.js';
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
import { useLocation } from 'react-router-dom';
import { NetworkInfo, WalletStatus } from './models';
import { WalletController, WalletControllerOptions } from './provider';
import { TxResult } from './tx';

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
  recheckExtensionStatus: () => void;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
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

  const recheckExtensionStatus = useCallback(() => {
    controller.current.recheckExtensionStatus();
  }, []);

  const post = useCallback(async (tx: CreateTxOptions) => {
    return controller.current.post(tx);
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
      recheckExtensionStatus,
      post,
    }),
    [
      connect,
      disconnect,
      network,
      post,
      recheckExtensionStatus,
      status,
      walletAddress,
    ],
  );

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): Wallet {
  return useContext(WalletContext);
}

export interface ConnectedWallet {
  network: NetworkInfo;
  walletAddress: HumanAddr;
}

export function useConnectedWallet(): ConnectedWallet | undefined {
  const { status, network, walletAddress } = useContext(WalletContext);

  if (
    status === WalletStatus.WALLET_CONNECTED &&
    typeof walletAddress === 'string' &&
    AccAddress.validate(walletAddress)
  ) {
    return {
      network,
      walletAddress: walletAddress as HumanAddr,
    };
  } else {
    return undefined;
  }
}

const interval = 1000 * 60;

export function useRouterWalletStatusRecheck() {
  const { pathname } = useLocation();
  const { recheckExtensionStatus } = useContext(WalletContext);

  const lastCheckTime = useRef<number>(Date.now());

  const check = useCallback(() => {
    recheckExtensionStatus();
    lastCheckTime.current = Date.now();
  }, [recheckExtensionStatus]);

  useEffect(() => {
    check();
  }, [check, pathname]);

  const tick = useCallback(() => {
    const now = Date.now();

    if (now > lastCheckTime.current + interval) {
      check();
    }
  }, [check]);

  useInterval(tick, interval);
}

export function RouterWalletStatusRecheck() {
  useRouterWalletStatusRecheck();
  return null;
}

export const WalletConsumer: Consumer<Wallet> = WalletContext.Consumer;
