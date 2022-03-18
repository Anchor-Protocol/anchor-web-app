import {
  RewardsAncGovernanceRewards,
  rewardsAncGovernanceRewardsQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(rewardsAncGovernanceRewardsQuery);

export function useRewardsAncGovernanceRewardsQuery(): UseQueryResult<
  RewardsAncGovernanceRewards | undefined
> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const { connected, terraWalletAddress } = useAccount();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_ANC_GOVERNANCE_REWARDS,
      terraWalletAddress,
      contractAddress.anchorToken.gov,
      contractAddress.cw20.ANC,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      enabled: connected,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connected ? result : EMPTY_QUERY_RESULT;
}
