import {
  AnchorContractAddress,
  useNetwork,
} from '@anchor-protocol/app-provider';
import { GasPrice, lastSyncedHeightQuery } from '@libs/app-fns';
import {
  HiveQueryClient,
  LcdQueryClient,
  QueryClient,
} from '@libs/query-client';
import { NetworkInfo } from '@terra-money/use-wallet';
import { useAnchorContractAddress } from 'queries/useAnchorContractAddress';
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
import { AppConstants, TxRefetchMap } from '../types';
import { LoadingScreen } from 'components/LoadingScreen';
import { getAnchorNetwork } from 'utils/getAnchorNetwork';
import { AnchorNetwork } from '@anchor-protocol/types';

export interface AppProviderProps<Constants extends AppConstants> {
  children: ReactNode;

  constants: Constants;

  defaultQueryClient?:
    | 'lcd'
    | 'hive'
    | ((network: NetworkInfo) => 'lcd' | 'hive');
  lcdQueryClient?: (network: NetworkInfo) => LcdQueryClient;
  hiveQueryClient?: (network: AnchorNetwork) => HiveQueryClient;

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

export interface App<Constants extends AppConstants> {
  constants: Constants;

  contractAddress: AnchorContractAddress;

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
const AppContext: Context<App<any>> = createContext<App<any>>();

export function AppProvider<Constants extends AppConstants>({
  children,
  constants,
  defaultQueryClient = 'hive',
  lcdQueryClient: _lcdQueryClient = DEFAULT_LCD_WASM_CLIENT,
  hiveQueryClient: _hiveQueryClient = DEFAULT_HIVE_WASM_CLIENT,
  gasPriceEndpoint = DEFAULT_GAS_PRICE_ENDPOINTS,
  fallbackGasPrice = DEFAULT_FALLBACK_GAS_PRICE,
  queryErrorReporter,
  txErrorReporter,
  refetchMap,
}: AppProviderProps<Constants>) {
  const { network } = useNetwork();
  const anchorNetwork = getAnchorNetwork(network.chainID);

  const { data: contractAddress } = useAnchorContractAddress();

  const lcdQueryClient = useMemo(
    () => _lcdQueryClient(network),
    [_lcdQueryClient, network],
  );
  const hiveQueryClient = useMemo(
    () => _hiveQueryClient(anchorNetwork),
    [_hiveQueryClient, anchorNetwork],
  );
  const queryClientType = useMemo(
    () =>
      typeof defaultQueryClient === 'function'
        ? defaultQueryClient(network)
        : defaultQueryClient,
    [defaultQueryClient, network],
  );
  const queryClient = useMemo(
    () => (queryClientType === 'lcd' ? lcdQueryClient : hiveQueryClient),
    [hiveQueryClient, lcdQueryClient, queryClientType],
  );

  const lastSyncedHeight = useMemo(() => {
    return () => lastSyncedHeightQuery(queryClient);
  }, [queryClient]);

  const {
    data: gasPrice = fallbackGasPrice(network) ?? fallbackGasPrice(network),
  } = useGasPriceQuery(
    gasPriceEndpoint(network) ?? gasPriceEndpoint(network),
    queryErrorReporter,
  );

  if (contractAddress === undefined) {
    return <LoadingScreen text="Loading contract addresses" />;
  }

  return (
    <AppContext.Provider
      value={{
        contractAddress,
        lcdQueryClient,
        hiveQueryClient,
        queryClient,
        lastSyncedHeight,
        txErrorReporter,
        queryErrorReporter,
        gasPrice,
        refetchMap,
        constants,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp<
  Constants extends AppConstants = AppConstants,
>(): App<Constants> {
  return useContext(AppContext);
}

export const AppConsumer: Consumer<App<any>> = AppContext.Consumer;
