import { CW20Addr, Token } from '@libs/types';
import { CW20TokenInfo, cw20TokenInfoQuery } from '@libs/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useBrowserInactive } from '@libs/use-browser-inactive';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { TERRA_QUERY_KEY } from '@libs/webapp-fns';

const queryFn = createQueryFn(cw20TokenInfoQuery);

export function useCW20TokenInfoQuery<T extends Token>(
  tokenAddr: CW20Addr,
  ignoreCache: boolean = false,
): UseQueryResult<CW20TokenInfo<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.CW20_TOKEN_INFO,
      tokenAddr,
      mantleEndpoint,
      mantleFetch,
      undefined,
      ignoreCache,
    ],
    queryFn as any,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<CW20TokenInfo<T> | undefined>;
}
