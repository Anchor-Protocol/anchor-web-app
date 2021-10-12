import { GovPoll, govPollQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(govPollQuery);

export function useGovPollQuery(
  pollId: number,
): UseQueryResult<GovPoll | undefined> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.GOV_POLL,
      contractAddress.anchorToken.gov,
      pollId,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
