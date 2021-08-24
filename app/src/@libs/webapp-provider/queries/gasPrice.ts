import { createQueryFn } from '@libs/react-query-utils';
import { GasPrice, gasPriceCache, gasPriceQuery } from '@libs/webapp-fns';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn((gasPriceEndpoint: string) => {
  return gasPriceQuery(gasPriceEndpoint);
});

export function useGasPriceQuery(
  gasPriceEndpoint: string,
  queryErrorReporter: ((error: unknown) => void) | undefined,
): UseQueryResult<GasPrice | undefined> {
  const result = useQuery(['TERRA_GAS_PRICE', gasPriceEndpoint], queryFn, {
    onError: queryErrorReporter,
    placeholderData: () => gasPriceCache.get(gasPriceEndpoint),
  });

  return result;
}
