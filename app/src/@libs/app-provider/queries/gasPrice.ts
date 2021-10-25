import { GasPrice, gasPriceQuery } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { TERRA_QUERY_KEY } from '../env';

const queryFn = createQueryFn((gasPriceEndpoint: string) => {
  return gasPriceQuery(gasPriceEndpoint);
});

export function useGasPriceQuery(
  gasPriceEndpoint: string,
  queryErrorReporter: ((error: unknown) => void) | undefined,
): UseQueryResult<GasPrice | undefined> {
  const result = useQuery(
    [TERRA_QUERY_KEY.TERRA_GAS_PRICE, gasPriceEndpoint],
    queryFn,
    {
      onError: queryErrorReporter,
    },
  );

  return result;
}
