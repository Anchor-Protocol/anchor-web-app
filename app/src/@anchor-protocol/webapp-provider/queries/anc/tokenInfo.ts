import { CW20Addr } from '@anchor-protocol/types';
import { AncTokenInfo, ancTokenInfoQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { MantleFetch, useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (mantleEndpoint: string, mantleFetch: MantleFetch, ancContract: CW20Addr) => {
    return ancTokenInfoQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        ancTokenInfo: {
          contractAddress: ancContract,
          query: {
            token_info: {},
          },
        },
      },
    });
  },
);

export function useAncTokenInfoQuery(): UseQueryResult<
  AncTokenInfo | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { cw20 },
  } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.ANC_TOKEN_INFO, mantleEndpoint, mantleFetch, cw20.ANC],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 10,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
