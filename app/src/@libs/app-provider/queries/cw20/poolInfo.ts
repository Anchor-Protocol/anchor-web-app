import { CW20PoolInfo, cw20PoolInfoQuery } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr, Token } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(cw20PoolInfoQuery);

export function useCW20PoolInfoQuery<T extends Token>(
  tokenAddr: CW20Addr,
): UseQueryResult<CW20PoolInfo<T> | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useApp();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.STAKING_POOL_INFO,
      tokenAddr,
      contractAddress.terraswap.factory,
      queryClient,
    ],
    queryFn as any,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<CW20PoolInfo<T>>;
}
