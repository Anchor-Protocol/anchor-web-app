import { useNetwork } from '@anchor-protocol/app-provider';
import { GasPrice, lastSyncedHeightQuery } from '@libs/app-fns';
import {
  HiveQueryClient,
  LcdQueryClient,
  QueryClient,
} from '@libs/query-client';
import { NetworkInfo } from '@terra-money/use-wallet';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import {
  DEFAULT_FALLBACK_GAS_PRICE,
  DEFAULT_GAS_PRICE_ENDPOINTS,
  DEFAULT_HIVE_WASM_CLIENT,
  DEFAULT_LCD_WASM_CLIENT,
} from '../env';
import { useGasPriceQuery } from '../queries/gasPrice';
import { AppConstants, AppContractAddress, TxRefetchMap } from '../types';

export interface AppProviderProps<
  ContractAddress extends AppContractAddress,
  Constants extends AppConstants,
> {
  children: ReactNode;

  contractAddress: (network: NetworkInfo) => ContractAddress;
  constants: (network: NetworkInfo) => Constants;

  defaultQueryClient?:
    | 'lcd'
    | 'hive'
    | ((network: NetworkInfo) => 'lcd' | 'hive');
  lcdQueryClient?: (network: NetworkInfo) => LcdQueryClient;
  hiveQueryClient?: (network: NetworkInfo) => HiveQueryClient;

  // gas
  gasPriceEndpoint?: (network: NetworkInfo) => string;
  fallbackGasPrice?: (network: NetworkInfo) => GasPrice;

  // refetch map
  refetchMap: TxRefetchMap;

  // sentry captureException()
  txErrorReporter?: (error: unknown) => string;

  // sentry captureException()
  queryErrorReporter?: (error: unknown) => void;
}

export interface App<
  ContractAddress extends AppContractAddress,
  Constants extends AppConstants,
> {
  contractAddress: ContractAddress;
  constants: Constants;

  // functions
  lastSyncedHeight: () => Promise<number>;

  // wasm
  queryClient: QueryClient;
  lcdQueryClient: LcdQueryClient;
  hiveQueryClient: HiveQueryClient;

  // gas
  gasPrice: GasPrice;

  // refetch map
  refetchMap: TxRefetchMap;

  // sentry captureException()
  txErrorReporter?: (error: unknown) => string;

  // sentry captureException()
  queryErrorReporter?: (error: unknown) => void;
}

//@ts-ignore
const AppContext: Context<App<any, any>> = createContext<App<any, any>>();

export function AppProvider<
  ContractAddress extends AppContractAddress,
  Constants extends AppConstants,
>({
  children,
  contractAddress,
  constants,
  defaultQueryClient = 'hive',
  lcdQueryClient: _lcdQueryClient = DEFAULT_LCD_WASM_CLIENT,
  hiveQueryClient: _hiveQueryClient = DEFAULT_HIVE_WASM_CLIENT,
  gasPriceEndpoint = DEFAULT_GAS_PRICE_ENDPOINTS,
  fallbackGasPrice = DEFAULT_FALLBACK_GAS_PRICE,
  queryErrorReporter,
  txErrorReporter,
  refetchMap,
}: AppProviderProps<ContractAddress, Constants>) {
  const { network } = useNetwork();

  const networkBoundStates = useMemo<
    Pick<
      App<any, any>,
      | 'contractAddress'
      | 'constants'
      | 'queryClient'
      | 'lcdQueryClient'
      | 'hiveQueryClient'
    >
  >(() => {
    const lcdQueryClient = _lcdQueryClient(network);
    const hiveQueryClient = _hiveQueryClient(network);
    const queryClientType =
      typeof defaultQueryClient === 'function'
        ? defaultQueryClient(network)
        : defaultQueryClient;
    const queryClient =
      queryClientType === 'lcd' ? lcdQueryClient : hiveQueryClient;

    return {
      contractAddress: contractAddress(network),
      constants: constants(network),
      queryClient,
      lcdQueryClient,
      hiveQueryClient,
    };
  }, [
    _hiveQueryClient,
    _lcdQueryClient,
    constants,
    contractAddress,
    defaultQueryClient,
    network,
  ]);

  const lastSyncedHeight = useMemo(() => {
    return () => lastSyncedHeightQuery(networkBoundStates.queryClient);
  }, [networkBoundStates.queryClient]);

  const {
    data: gasPrice = fallbackGasPrice(network) ?? fallbackGasPrice(network),
  } = useGasPriceQuery(
    gasPriceEndpoint(network) ?? gasPriceEndpoint(network),
    queryErrorReporter,
  );

  const states = useMemo<App<any, any>>(() => {
    return {
      ...networkBoundStates,
      lastSyncedHeight,
      txErrorReporter,
      queryErrorReporter,
      gasPrice,
      refetchMap,
    };
  }, [
    gasPrice,
    lastSyncedHeight,
    networkBoundStates,
    queryErrorReporter,
    refetchMap,
    txErrorReporter,
  ]);

  return <AppContext.Provider value={states}>{children}</AppContext.Provider>;
}

export function useApp<
  ContractAddress extends AppContractAddress = AppContractAddress,
  Constants extends AppConstants = AppConstants,
>(): App<ContractAddress, Constants> {
  return useContext(AppContext);
}

export const AppConsumer: Consumer<App<any, any>> = AppContext.Consumer;
