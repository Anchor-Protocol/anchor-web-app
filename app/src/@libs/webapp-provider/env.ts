import { NetworkInfo } from '@terra-dev/wallet-types';
import { UseQueryResult } from 'react-query';

export const DEFAULT_MANTLE_ENDPOINTS = (network: NetworkInfo): string => {
  if (network.chainID.startsWith('tequila')) {
    return 'https://tequila-mantle.anchorprotocol.com';
  } else if (network.chainID.startsWith('bombay')) {
    return 'https://bombay-mantle.mantle.dev';
  } else if (network.chainID === 'columbus-4') {
    return 'https://mantle.anchorprotocol.com';
  } else {
    return 'https://mantle.terra.dev';
  }
};

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
  isRefetchError: false,
  isSuccess: true,
  isStale: false,
  status: 'success',
  remove: () => {},
  refetch: () => Promise.resolve(EMPTY_QUERY_RESULT),
};

export const DEFAULT_NATIVE_TOKEN_KEYS = {
  uLuna: 'uluna',
  uSDR: 'usdr',
  uUST: 'uusd',
  uKRW: 'ukrw',
  uMNT: 'umnt',
  uEUR: 'ueur',
  uCNY: 'ucny',
  uJPY: 'ujpy',
  uGBP: 'ugbp',
  uINR: 'uinr',
  uCAD: 'ucad',
  uCHF: 'uchf',
  uAUD: 'uaud',
  uSGD: 'usgd',
  uTHB: 'uthb',
  uSEK: 'usek',
};
