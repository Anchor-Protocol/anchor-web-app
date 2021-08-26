import { AncTokenInfo, ancTokenInfoQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(ancTokenInfoQuery);

export function useAncTokenInfoQuery(): UseQueryResult<
  AncTokenInfo | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { cw20 },
  } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.ANC_TOKEN_INFO, cw20.ANC, mantleEndpoint, mantleFetch],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 10,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
