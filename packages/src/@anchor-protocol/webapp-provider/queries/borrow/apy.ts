import { BorrowAPYData, borrowAPYQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch],
}: QueryFunctionContext<[string, string, MantleFetch]>) => {
  return borrowAPYQuery({
    mantleEndpoint,
    mantleFetch,
  });
};

export function useBorrowAPYQuery(): UseQueryResult<BorrowAPYData | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  return useQuery(
    [ANCHOR_QUERY_KEY.BORROW_APY, mantleEndpoint, mantleFetch],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
