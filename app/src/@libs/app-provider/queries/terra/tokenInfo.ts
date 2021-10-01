import { terraTokenInfoQuery } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { cw20, terraswap, Token } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(terraTokenInfoQuery);

export function useTerraTokenInfo<T extends Token>(
  asset: terraswap.AssetInfo,
): UseQueryResult<cw20.TokenInfoResponse<T> | undefined> {
  const { queryClient, queryErrorReporter } = useApp();

  const result = useQuery(
    [TERRA_QUERY_KEY.TERRA_TOKEN_INFO, asset, queryClient],
    queryFn as any,
    {
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as any;
}
