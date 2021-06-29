import { HumanAddr } from '@anchor-protocol/types';
import { GovState, govStateQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    govContract: HumanAddr,
  ) => {
    return govStateQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        govState: {
          contractAddress: govContract,
          query: {
            state: {},
          },
        },
        govConfig: {
          contractAddress: govContract,
          query: {
            config: {},
          },
        },
      },
    });
  },
);

export function useGovStateQuery(): UseQueryResult<GovState | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { anchorToken },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.GOV_STATE, mantleEndpoint, mantleFetch, anchorToken.gov],
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
