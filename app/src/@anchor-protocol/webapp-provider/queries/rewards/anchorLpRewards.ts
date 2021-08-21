import {
  RewardsAnchorLpRewardsData,
  rewardsAnchorLpRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@packages/react-query-utils';
import { MantleFetch, useTerraWebapp } from '@packages/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (mantleEndpoint: string, mantleFetch: MantleFetch) => {
    return rewardsAnchorLpRewardsQuery({
      mantleEndpoint,
      mantleFetch,
    });
  },
);

export function useRewardsAnchorLpRewardsQuery(): UseQueryResult<
  RewardsAnchorLpRewardsData | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.REWARDS_ANCHOR_LP_REWARDS, mantleEndpoint, mantleFetch],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
