import { AncTokenInfo, ancTokenInfoQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(ancTokenInfoQuery);

export function useAncTokenInfoQuery(): UseQueryResult<
  AncTokenInfo | undefined
> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.ANC_TOKEN_INFO, contractAddress.cw20.ANC, queryClient],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 10,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
