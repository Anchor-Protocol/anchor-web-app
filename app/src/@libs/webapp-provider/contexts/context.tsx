import { useWallet } from '@terra-money/wallet-provider';
import {
  defaultMantleFetch,
  lastSyncedHeightQuery,
  MantleFetch,
} from '@libs/webapp-fns';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { DEFAULT_MANTLE_ENDPOINTS } from '../env';
import { TxRefetchMap } from '../types';

export interface TerraWebappProviderProps {
  children: ReactNode;

  // mantle
  mantleEndpoints?: Record<string, string>;
  mantleFetch?: MantleFetch;

  // refetch map
  txRefetchMap?: TxRefetchMap;

  // sentry captureException()
  txErrorReporter?: (error: unknown) => string;

  // sentry captureException()
  queryErrorReporter?: (error: unknown) => void;
}

export interface TerraWebapp {
  // functions
  lastSyncedHeight: () => Promise<number>;

  // mantle
  mantleEndpoint: string;
  mantleFetch: MantleFetch;

  // sentry captureException()
  txErrorReporter?: (error: unknown) => string;

  // sentry captureException()
  queryErrorReporter?: (error: unknown) => void;

  txRefetchMap: TxRefetchMap;
}

export const TerraWebappContext: Context<TerraWebapp> =
  // @ts-ignore
  createContext<TerraWebapp>();

export function TerraWebappProvider({
  children,
  mantleEndpoints = DEFAULT_MANTLE_ENDPOINTS,
  mantleFetch = defaultMantleFetch,
  txRefetchMap = {},
  txErrorReporter,
  queryErrorReporter,
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
      txRefetchMap,
      queryErrorReporter,
    }),
    [
      lastSyncedHeight,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      txRefetchMap,
      queryErrorReporter,
    ],
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
