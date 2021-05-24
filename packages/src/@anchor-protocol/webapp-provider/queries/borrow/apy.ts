import {
  ANCHOR_QUERY_KEY,
  BorrowAPYData,
  borrowAPYQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export function useBorrowAPYQuery(): UseQueryResult<BorrowAPYData | undefined> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const queryFn = useCallback(() => {
    return borrowAPYQuery({
      mantleEndpoint,
      mantleFetch,
    });
  }, [mantleEndpoint, mantleFetch]);

  return useQuery(ANCHOR_QUERY_KEY.BORROW_APY, queryFn, {
    refetchInterval: browserInactive && 1000 * 60 * 5,
    enabled: !browserInactive,
    keepPreviousData: true,
  });
}
