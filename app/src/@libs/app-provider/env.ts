import { GasPrice } from '@libs/app-fns';
import {
  defaultHiveFetcher,
  defaultLcdFetcher,
  HiveQueryClient,
  LcdQueryClient,
} from '@libs/query-client';
import { NetworkInfo } from '@terra-money/use-wallet';
import { UseQueryResult } from 'react-query';

export function DEFAULT_HIVE_WASM_CLIENT(
  network: NetworkInfo,
): HiveQueryClient {
  if (network.chainID.startsWith('bombay')) {
    return {
      hiveEndpoint: 'https://bombay-mantle.terra.dev',
      hiveFetcher: defaultHiveFetcher,
    };
  } else {
    return {
      hiveEndpoint: 'https://mantle.terra.dev',
      hiveFetcher: defaultHiveFetcher,
    };
  }
}

export function DEFAULT_LCD_WASM_CLIENT(network: NetworkInfo): LcdQueryClient {
  return {
    lcdEndpoint: network.lcd,
    lcdFetcher: defaultLcdFetcher,
  };
}

export function DEFAULT_GAS_PRICE_ENDPOINTS(network: NetworkInfo): string {
  const fcd = network.lcd.replace(/lcd/, 'fcd');
  return `${fcd}/v1/txs/gas_prices`;
}

const FALLBACK_GAS_PRICE_COLUMNBUS = {
  uluna: '0.01133',
  usdr: '0.104938',
  uusd: '0.15',
  ukrw: '169.77',
  umnt: '428.571',
  ueur: '0.125',
  ucny: '0.98',
  ujpy: '16.37',
  ugbp: '0.11',
  uinr: '10.88',
  ucad: '0.19',
  uchf: '0.14',
  uaud: '0.19',
  usgd: '0.2',
  uthb: '4.62',
  usek: '1.25',
  unok: '1.25',
  udkk: '0.9',
  uidr: '2180.0',
  uphp: '7.6',
  uhkd: '1.17',
};

const FALLBACK_GAS_PRICE_BOMBAY = {
  ...FALLBACK_GAS_PRICE_COLUMNBUS,
  uluna: '0.15',
  usdr: '0.1018',
  uusd: '0.15',
  ukrw: '178.05',
  umnt: '431.6259',
  ueur: '0.125',
  ucny: '0.97',
  ujpy: '16',
  ugbp: '0.11',
  uinr: '11',
  ucad: '0.19',
  uchf: '0.13',
  uaud: '0.19',
  usgd: '0.2',
  uthb: '4.62',
  usek: '1.25',
  unok: '1.25',
  udkk: '0.9',
};

export function DEFAULT_FALLBACK_GAS_PRICE(network: NetworkInfo): GasPrice {
  if (network.chainID.startsWith('bombay')) {
    return FALLBACK_GAS_PRICE_BOMBAY as GasPrice;
  } else {
    return FALLBACK_GAS_PRICE_COLUMNBUS as GasPrice;
  }
}

export const EMPTY_QUERY_RESULT: UseQueryResult<undefined> = {
  data: undefined,
  dataUpdatedAt: 0,
  error: null,
  errorUpdatedAt: 0,
  failureCount: 0,
  isError: false,
  isFetched: false,
  isFetchedAfterMount: false,
  isIdle: false,
  isLoading: false,
  isLoadingError: false,
  isPlaceholderData: false,
  isPreviousData: false,
  isFetching: false,
  isRefetching: false,
  isRefetchError: false,
  isSuccess: true,
  isStale: false,
  status: 'success',
  remove: () => {},
  refetch: () => Promise.resolve(EMPTY_QUERY_RESULT),
};

export enum TERRA_TX_KEYS {
  CW20_BUY = 'NEBULA_TX_CW20_BUY',
  CW20_SELL = 'NEBULA_TX_CW20_SELL',
  SEND = 'NEBULA_TX_SEND',
}

export enum TERRA_QUERY_KEY {
  TOKEN_BALANCES = 'TERRA_QUERY_TOKEN_BALANCES',
  CW20_BALANCE = 'TERRA_QUERY_CW20_BALANCE',
  CW20_TOKEN_DISPLAY_INFOS = 'TERRA_QUERY_CW20_TOKEN_DISPLAY_INFOS',
  TERRA_TOKEN_DISPLAY_INFOS = 'TERRA_QUERY_TERRA_TOKEN_DISPLAY_INFOS',
  CW20_TOKEN_INFO = 'NEBULA_QUERY_CW20_TOKEN_INFO',
  STAKING_POOL_INFO = 'NEBULA_QUERY_STAKING_CLUSTER_POOL_INFO_LIST',
  TERRASWAP_PAIR = 'NEBULA_QUERY_TERRASWAP_PAIR',
  TERRASWAP_POOL = 'NEBULA_QUERY_TERRASWAP_POOL',
  TERRA_BALANCES = 'NEBULA_QUERY_TERRA_BALANCES',
  TERRA_BALANCES_WITH_TOKEN_INFO = 'NEBULA_QUERY_TERRA_BALANCES_WITH_TOKEN_INFO',
  TERRA_NATIVE_BALANCES = 'NEBULA_QUERY_TERRA_NATIVE_BALANCES',
  TERRA_TOKEN_INFO = 'NEBULA_QUERY_TERRA_TOKEN_INFO',
  TERRA_TREASURY_TAX_CAP = 'TERRA_QUERY_TERRA_TREASURY_TAX_CAP',
  TERRA_TREASURY_TAX_RATE = 'TERRA_QUERY_TERRA_TREASURY_TAX_RATE',
  TERRA_GAS_PRICE = 'TERRA_QUERY_GAS_PRICE',
  ASTROPORT_DEPOSIT = 'ASTROPORT_QUERY_DEPOSIT',
}

export enum EVM_QUERY_KEY {
  EVM_NATIVE_BALANCES = 'EVM_NATIVE_BALANCES',
  ERC20_BALANCE = 'EVM_ERC20_BALANCE',
}

export const REFETCH_INTERVAL = 1000 * 60 * 5;
