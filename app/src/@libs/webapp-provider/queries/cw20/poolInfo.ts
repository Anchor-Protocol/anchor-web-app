import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr, Token } from '@libs/types';
import { useBrowserInactive } from '@libs/use-browser-inactive';
import {
  CW20PoolInfo,
  cw20PoolInfoQuery,
  TERRA_QUERY_KEY,
} from '@libs/webapp-fns';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(cw20PoolInfoQuery);

export function useCW20PoolInfoQuery<T extends Token>(
  tokenAddr: CW20Addr,
): UseQueryResult<CW20PoolInfo<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter, contractAddress } =
    useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.STAKING_POOL_INFO,
      tokenAddr,
      contractAddress.terraswap.factory,
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

  return result as UseQueryResult<CW20PoolInfo<T>>;
}
