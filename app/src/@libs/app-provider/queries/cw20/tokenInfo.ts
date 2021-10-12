import { CW20TokenInfo, cw20TokenInfoQuery } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr, Token } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(cw20TokenInfoQuery);

export function useCW20TokenInfoQuery<T extends Token>(
  tokenAddr: CW20Addr,
  ignoreCache: boolean = false,
): UseQueryResult<CW20TokenInfo<T> | undefined> {
  const { queryClient, queryErrorReporter } = useApp();

  const result = useQuery(
    [TERRA_QUERY_KEY.CW20_TOKEN_INFO, tokenAddr, queryClient, ignoreCache],
    queryFn as any,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<CW20TokenInfo<T> | undefined>;
}
