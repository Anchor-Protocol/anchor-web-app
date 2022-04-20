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
import { useLocalAnchorContractAddressQuery } from 'queries';
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
import { BOMBAY_CONTRACT_ADDRESS, COLUMBUS_CONTRACT_ADDRESS } from 'env';
import { getAnchorContractAddress } from '@anchor-protocol/app-provider/utils/getAnchorContractAddress';

export interface AppProviderProps<Constants extends AppConstants> {
  children: ReactNode;

  constants: Constants;

  defaultQueryClient?:
    | 'lcd'
    | 'hive'
    | ((network: AnchorNetwork) => 'lcd' | 'hive');
  lcdQueryClient?: (network: NetworkInfo) => LcdQueryClient;
  hiveQueryClient?: (network: AnchorNetwork) => HiveQueryClient;

  // gas
  gasPriceEndpoint?: (network: NetworkInfo) => string;
  fallbackGasPrice?: (network: AnchorNetwork) => GasPrice;

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
  const isLocalAnchor = anchorNetwork === AnchorNetwork.Local;

  const { data: localAnchorContractAddress } =
    useLocalAnchorContractAddressQuery({
      enabled: anchorNetwork === AnchorNetwork.Local,
    });

  const contractAddress = useMemo(() => {
    if (isLocalAnchor) {
      return localAnchorContractAddress;
    }

    const addressMap =
      anchorNetwork === AnchorNetwork.Main
        ? COLUMBUS_CONTRACT_ADDRESS
        : BOMBAY_CONTRACT_ADDRESS;

    return getAnchorContractAddress(addressMap);
  }, [anchorNetwork, isLocalAnchor, localAnchorContractAddress]);

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
        ? defaultQueryClient(anchorNetwork)
        : defaultQueryClient,
    [defaultQueryClient, anchorNetwork],
  );
  const queryClient = useMemo(
    () => (queryClientType === 'lcd' ? lcdQueryClient : hiveQueryClient),
    [hiveQueryClient, lcdQueryClient, queryClientType],
  );

  const lastSyncedHeight = useMemo(() => {
    return () => lastSyncedHeightQuery(queryClient);
  }, [queryClient]);

  const { data: gasPrice = fallbackGasPrice(anchorNetwork) } = useGasPriceQuery(
    gasPriceEndpoint(network) ?? gasPriceEndpoint(network),
    queryErrorReporter,
  );

  if (contractAddress === undefined) {
    return isLocalAnchor ? (
      <LoadingScreen text="Loading contract addresses" />
    ) : null;
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
