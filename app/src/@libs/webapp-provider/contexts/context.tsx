import {
  DEFAULT_GAS_PRICE_ENDPOINT,
  defaultMantleFetch,
  FALLBACK_GAS_PRICE,
  GasPrice,
  lastSyncedHeightQuery,
  MantleFetch,
} from '@libs/webapp-fns';
import { useWallet } from '@terra-money/wallet-provider';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { DEFAULT_MANTLE_ENDPOINTS } from '../env';
import { useGasPriceQuery } from '../queries/gasPrice';
import { TxRefetchMap } from '../types';

export interface TerraWebappProviderProps {
  children: ReactNode;

  // mantle
  mantleEndpoints?: Record<string, string>;
  mantleFetch?: MantleFetch;

  // gas
  gasPriceEndpoint?: Record<string, string>;
  fallbackGasPrice?: Record<string, GasPrice>;

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

  // gas
  gasPrice: GasPrice;

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
  gasPriceEndpoint = DEFAULT_GAS_PRICE_ENDPOINT,
  fallbackGasPrice = FALLBACK_GAS_PRICE,
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

  const {
    data: gasPrice = fallbackGasPrice[network.name] ??
      fallbackGasPrice['mainnet'],
  } = useGasPriceQuery(
    gasPriceEndpoint[network.name] ?? gasPriceEndpoint['mainnet'],
    queryErrorReporter,
  );

  const states = useMemo<TerraWebapp>(
    () => ({
      lastSyncedHeight,
      mantleEndpoint,
      mantleFetch,
      gasPrice,
      txErrorReporter,
      txRefetchMap,
      queryErrorReporter,
    }),
    [
      lastSyncedHeight,
      mantleEndpoint,
      mantleFetch,
      gasPrice,
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
