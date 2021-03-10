import { Network, useNetwork } from '@anchor-protocol/use-network';
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

export const ServiceConsumer: Consumer<Service> = ServiceContext.Consumer;
