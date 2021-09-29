import { BorrowAPYData, borrowAPYQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(borrowAPYQuery);

export function useBorrowAPYQuery(): UseQueryResult<BorrowAPYData | undefined> {
  const { queryErrorReporter } = useTerraWebapp();

  return useQuery([ANCHOR_QUERY_KEY.BORROW_APY], queryFn, {
    refetchInterval: 1000 * 60 * 5,
    keepPreviousData: true,
    onError: queryErrorReporter,
  });
}
