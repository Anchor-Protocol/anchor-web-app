import { Network, useNetwork } from '@anchor-protocol/use-network';
import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext, useMemo } from 'react';

export interface ServiceProviderProps {
  children: ReactNode;
}

export interface Service extends Network {}

// @ts-ignore
const ServiceContext: Context<Service> = createContext<Service>();

export function ServiceProvider({ children }: ServiceProviderProps) {
  const { online } = useNetwork();

  const state = useMemo(
    () => ({
      online,
    }),
    [online],
  );

  return (
    <ServiceContext.Provider value={state}>{children}</ServiceContext.Provider>
  );
}

export function useService(): Service {
  return useContext(ServiceContext);
}

export const ServiceConsumer: Consumer<Service> = ServiceContext.Consumer;
