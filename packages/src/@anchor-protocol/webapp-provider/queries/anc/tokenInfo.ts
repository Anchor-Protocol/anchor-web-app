import { CW20Addr } from '@anchor-protocol/types';
import {
  AncTokenInfoData,
  ancTokenInfoQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, ancContract],
}: QueryFunctionContext<[string, string, MantleFetch, CW20Addr]>) => {
  return ancTokenInfoQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      ancContract,
      ancTokenInfoQuery: {
        token_info: {},
      },
    },
  });
};

export function useAncTokenInfoQuery(): UseQueryResult<
  AncTokenInfoData | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.ANC_TOKEN_INFO, mantleEndpoint, mantleFetch, cw20.ANC],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
