import { createQueryFn } from '@libs/react-query-utils';
import { useBrowserInactive } from '@libs/use-browser-inactive';
import {
  TERRA_QUERY_KEY,
  TerraswapPool,
  terraswapPoolQuery,
} from '@libs/webapp-fns';
import { useTerraWebapp } from '@libs/webapp-provider';
import { HumanAddr, Token } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(terraswapPoolQuery);

export function useTerraswapPoolQuery<T extends Token>(
  terraswapPairAddr: HumanAddr | undefined,
): UseQueryResult<TerraswapPool<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.TERRASWAP_POOL,
      terraswapPairAddr,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn as any,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<TerraswapPool<T> | undefined>;
}
