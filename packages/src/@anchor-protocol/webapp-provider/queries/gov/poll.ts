import { HumanAddr } from '@anchor-protocol/types';
import { GovPollData, govPollQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, govContract, pollId],
}: QueryFunctionContext<[string, string, MantleFetch, HumanAddr, number]>) => {
  return govPollQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      govContract,
      pollQuery: {
        poll: {
          poll_id: pollId,
        },
      },
    },
  });
};

export function useGovPollQuery(
  pollId: number,
): UseQueryResult<GovPollData | undefined> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    contractAddress: { anchorToken },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.GOV_DISTRIBUTION_MODEL_UPDATE_CONFIG,
      mantleEndpoint,
      mantleFetch,
      anchorToken.gov,
      pollId,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
    },
  );

  return result;
}
