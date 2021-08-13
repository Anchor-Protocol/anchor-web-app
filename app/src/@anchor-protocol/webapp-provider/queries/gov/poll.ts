import { HumanAddr } from '@anchor-protocol/types';
import { GovPoll, govPollQuery } from '@anchor-protocol/webapp-fns';
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
    pollId: number,
  ) => {
    return govPollQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        poll: {
          contractAddress: govContract,
          query: {
            poll: {
              poll_id: pollId,
            },
          },
        },
      },
    });
  },
);

export function useGovPollQuery(
  pollId: number,
): UseQueryResult<GovPoll | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { anchorToken },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.GOV_POLL,
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
      onError: queryErrorReporter,
    },
  );

  return result;
}
