import { useWallet } from '@terra-money/wallet-provider';
import {
  defaultMantleFetch,
  lastSyncedHeightQuery,
  MantleFetch,
} from '@terra-money/webapp-fns';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { DEFAULT_MANTLE_ENDPOINTS } from '../env';

export interface TerraWebappProviderProps {
  children: ReactNode;

  // mantle
  mantleEndpoints?: Record<string, string>;
  mantleFetch?: MantleFetch;

  // refetch map
  txRefetchMap?: Record<string, string[]>;

  // sentry captureException()
  txErrorReporter?: (error: unknown) => string;
}

export interface TerraWebapp {
  // functions
  lastSyncedHeight: () => Promise<number>;

  // mantle
  mantleEndpoint: string;
  mantleFetch: MantleFetch;

  // sentry captureException()
  txErrorReporter?: (error: unknown) => string;
}

// @ts-ignore
export const TerraWebappContext: Context<TerraWebapp> = createContext<TerraWebapp>();

export function TerraWebappProvider({
  children,
  mantleEndpoints = DEFAULT_MANTLE_ENDPOINTS,
  mantleFetch = defaultMantleFetch,
  txRefetchMap = {},
  txErrorReporter,
}: TerraWebappProviderProps) {
  const { network } = useWallet();

  const mantleEndpoint = useMemo(() => {
    return mantleEndpoints[network.name] ?? mantleEndpoints['mainnet'];
  }, [mantleEndpoints, network.name]);

  const lastSyncedHeight = useMemo(() => {
    return () =>
      lastSyncedHeightQuery({
        mantleEndpoint,
        mantleFetch,
      });
  }, [mantleEndpoint, mantleFetch]);

  const states = useMemo<TerraWebapp>(
    () => ({
      lastSyncedHeight,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
    }),
    [lastSyncedHeight, mantleEndpoint, mantleFetch, txErrorReporter],
  );

  return (
    <TerraWebappContext.Provider value={states}>
      {children}
    </TerraWebappContext.Provider>
  );
}

export function useTerraWebapp(): TerraWebapp {
  return useContext(TerraWebappContext);
}

export const TerraWebappConsumer: Consumer<TerraWebapp> =
  TerraWebappContext.Consumer;
