import { defaultMantleFetch, MantleFetch } from '@libs/mantle';
import { TerraContractAddress, u, UST } from '@libs/types';
import {
  DEFAULT_GAS_PRICE_ENDPOINT,
  DEFAULT_TERRA_CONSTANTS,
  DEFAULT_TERRA_CONTRACT_ADDRESS,
  FALLBACK_GAS_PRICE,
  GasPrice,
  lastSyncedHeightQuery,
  TerraContants,
  TerraContantsInput,
} from '@libs/webapp-fns';
import { useWallet } from '@terra-dev/use-wallet';
import big from 'big.js';
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

  contractAddress?: Record<string, TerraContractAddress>;
  constants?: Record<string, TerraContantsInput>;

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
  contractAddress: TerraContractAddress;
  constants: TerraContants;

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
  contractAddress = DEFAULT_TERRA_CONTRACT_ADDRESS,
  constants = DEFAULT_TERRA_CONSTANTS,
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

  const states = useMemo<TerraWebapp>(() => {
    const constantsInput = constants[network.name] ?? constants['mainnet'];
    const calculateGasCalculated = {
      ...constantsInput,
      fixedGas: Math.floor(
        big(constantsInput.fixedGasGas).mul(gasPrice.uusd).toNumber(),
      ) as u<UST<number>>,
    };

    return {
      lastSyncedHeight,
      mantleEndpoint,
      mantleFetch,
      gasPrice,
      txErrorReporter,
      txRefetchMap,
      queryErrorReporter,
      contractAddress:
        contractAddress[network.name] ?? contractAddress['mainnet'],
      constants: calculateGasCalculated,
    };
  }, [
    constants,
    network.name,
    gasPrice,
    lastSyncedHeight,
    mantleEndpoint,
    mantleFetch,
    txErrorReporter,
    txRefetchMap,
    queryErrorReporter,
    contractAddress,
  ]);

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
