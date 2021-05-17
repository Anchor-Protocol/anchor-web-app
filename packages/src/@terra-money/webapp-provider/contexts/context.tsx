import { NetworkInfo } from '@terra-dev/wallet-types';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { DEFAULT_MANTLE_ENDPOINTS } from '../env';
import { useBlockHeightBoundNetwork } from './internal/useBlockHeightBoundNetwork';

export type MantleFetch = <Variables extends {}, Data>(
  query: string,
  variables: Variables,
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => Promise<Data>;

export interface TerraWebappProviderProps {
  children: ReactNode;

  // block height
  blockHeightRefetchIntervalMs?: number;

  // mantle
  mantleEndpoints?: Record<string, string>;
  mantleFetch?: MantleFetch;

  // refetch map
  txRefetchMap?: Record<string, string[]>;

  // sentry captureException()
  txErrorReporter?: (error: unknown) => string;
}

export interface TerraWebapp {
  // network
  blockHeight: number;
  network: NetworkInfo;
  refetchBlockHeight: () => Promise<number>;

  // mantle
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
}

// @ts-ignore
export const TerraWebappContext: Context<TerraWebapp> = createContext<TerraWebapp>();

const defaultMantleFetch: MantleFetch = <Variables extends {}, Data>(
  query: string,
  variables: Variables,
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => {
  return fetch(endpoint, {
    ...requestInit,
    method: 'POST',
    headers: {
      ...requestInit?.headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((res) => res.json())
    .then(({ data }) => data) as Promise<Data>;
};

export function TerraWebappProvider({
  children,
  mantleEndpoints = DEFAULT_MANTLE_ENDPOINTS,
  mantleFetch = defaultMantleFetch,
  blockHeightRefetchIntervalMs = 1000 * 60 * 3,
  txRefetchMap = {},
  txErrorReporter,
}: TerraWebappProviderProps) {
  const {
    network,
    blockHeight,
    refetchBlockHeight,
  } = useBlockHeightBoundNetwork({
    mantleEndpoints,
    mantleFetch,
    intervalMs: blockHeightRefetchIntervalMs,
  });

  const states = useMemo<TerraWebapp>(
    () => ({
      network,
      blockHeight,
      refetchBlockHeight,
      mantleEndpoint:
        mantleEndpoints[network.name] ?? mantleEndpoints['mainnet'],
      mantleFetch,
    }),
    [blockHeight, mantleEndpoints, mantleFetch, network, refetchBlockHeight],
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
