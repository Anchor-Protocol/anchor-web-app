import { BorrowAPYData, borrowAPYQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { MantleFetch, useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (mantleEndpoint: string, mantleFetch: MantleFetch) => {
    return borrowAPYQuery({
      mantleEndpoint,
      mantleFetch,
    });
  },
);

export function useBorrowAPYQuery(): UseQueryResult<BorrowAPYData | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  return useQuery(
    [ANCHOR_QUERY_KEY.BORROW_APY, mantleEndpoint, mantleFetch],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
