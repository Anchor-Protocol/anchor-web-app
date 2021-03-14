import {
  useWallet,
  WalletReady,
  WalletStatus,
} from '@anchor-protocol/wallet-provider';
import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext, useMemo } from 'react';

export interface ServiceProviderProps {
  children: ReactNode;
}

export interface Service {
  serviceAvailable: boolean;
  walletReady: WalletReady | undefined;
  walletStatus: WalletStatus;
}

// @ts-ignore
const ServiceContext: Context<Service> = createContext<Service>();

export function ServiceProvider({ children }: ServiceProviderProps) {
  const { status: walletStatus } = useWallet();

  const state = useMemo<Service>(() => {
    return {
      serviceAvailable: walletStatus.status === 'ready',
      walletReady: walletStatus.status === 'ready' ? walletStatus : undefined,
      walletStatus,
    };
  }, [walletStatus]);

  return (
    <ServiceContext.Provider value={state}>{children}</ServiceContext.Provider>
  );
}

export function useService(): Service {
  return useContext(ServiceContext);
}

export const ServiceConsumer: Consumer<Service> = ServiceContext.Consumer;
