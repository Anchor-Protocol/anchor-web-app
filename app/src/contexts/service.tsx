import { Network, useNetwork } from '@anchor-protocol/use-network';
import {
  useWallet,
  WalletReady,
  WalletStatus,
} from '@anchor-protocol/wallet-provider';
import type { DependencyList, ReactNode } from 'react';
import { Consumer, Context, createContext, useContext, useMemo } from 'react';

export interface ServiceProviderProps {
  children: ReactNode;
}

export interface Service extends Network {
  serviceAvailable: boolean;
  walletReady: WalletReady | undefined;
  walletStatus: WalletStatus;
}

// @ts-ignore
const ServiceContext: Context<Service> = createContext<Service>();

export function ServiceProvider({ children }: ServiceProviderProps) {
  const { online } = useNetwork();
  const { status: walletStatus } = useWallet();

  const state = useMemo<Service>(() => {
    return {
      serviceAvailable: walletStatus.status === 'ready' && online,
      online,
      walletReady:
        walletStatus.status === 'ready' && online ? walletStatus : undefined,
      walletStatus,
    };
  }, [online, walletStatus]);

  return (
    <ServiceContext.Provider value={state}>{children}</ServiceContext.Provider>
  );
}

export function useService(): Service {
  return useContext(ServiceContext);
}

export function useServiceConnectedMemo<T>(
  factory: () => T,
  deps: DependencyList,
  fallback: T,
): T {
  const { serviceAvailable } = useContext(ServiceContext);

  //eslint-disable-next-line
  const value = useMemo(factory, deps);

  return serviceAvailable ? value : fallback;
}

//export function useServiceConnectedCallback<F extends (...args: any[]) => any>(
//  callback: F,
//  deps: DependencyList,
//  fallback: ReturnType<F> extends Promise<infer R> ? R : ReturnType<F>,
//): F {
//  const { serviceAvailable } = useContext(ServiceContext);
//
//  //eslint-disable-next-line
//  const realCallback = useCallback(callback, deps);
//
//  return serviceAvailable ? realCallback : ((() => fallback) as F);
//}

export const ServiceConsumer: Consumer<Service> = ServiceContext.Consumer;
