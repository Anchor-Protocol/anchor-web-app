import { TerraswapPool, terraswapPoolQuery } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { HumanAddr, Token } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(terraswapPoolQuery);

export function useTerraswapPoolQuery<T extends Token>(
  terraswapPairAddr: HumanAddr | undefined,
): UseQueryResult<TerraswapPool<T> | undefined> {
  const { queryClient, queryErrorReporter } = useApp();

  const result = useQuery(
    [TERRA_QUERY_KEY.TERRASWAP_POOL, terraswapPairAddr, queryClient],
    queryFn as any,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<TerraswapPool<T> | undefined>;
}
