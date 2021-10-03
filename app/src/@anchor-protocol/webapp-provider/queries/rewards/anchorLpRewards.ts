import {
  RewardsAnchorLpRewardsData,
  rewardsAnchorLpRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider/contexts/context';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(rewardsAnchorLpRewardsQuery);

export function useRewardsAnchorLpRewardsQuery(): UseQueryResult<
  RewardsAnchorLpRewardsData | undefined
> {
  const { queryErrorReporter } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.REWARDS_ANCHOR_LP_REWARDS],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
