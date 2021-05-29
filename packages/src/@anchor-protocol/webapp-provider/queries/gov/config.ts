import { HumanAddr } from '@anchor-protocol/types';
import { GovConfigData, govConfigQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, govContract],
}: QueryFunctionContext<[string, string, MantleFetch, HumanAddr]>) => {
  return govConfigQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      govContract,
      configQuery: {
        config: {},
      },
    },
  });
};

export function useGovConfigQuery(): UseQueryResult<GovConfigData | undefined> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    contractAddress: { anchorToken },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.GOV_CONFIG, mantleEndpoint, mantleFetch, anchorToken.gov],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
    },
  );

  return result;
}
