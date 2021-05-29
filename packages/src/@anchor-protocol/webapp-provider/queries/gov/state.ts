import { HumanAddr } from '@anchor-protocol/types';
import { GovStateData, govStateQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, govContract],
}: QueryFunctionContext<[string, string, MantleFetch, HumanAddr]>) => {
  return govStateQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      govContract,
      govStateQuery: {
        state: {},
      },
      govConfigQuery: {
        config: {},
      },
    },
  });
};

export function useGovStateQuery(): UseQueryResult<GovStateData | undefined> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

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
    },
  );

  return result;
}
