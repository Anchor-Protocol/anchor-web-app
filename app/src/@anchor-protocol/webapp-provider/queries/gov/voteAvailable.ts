import { useMemo } from 'react';
import { useRewardsAncGovernanceRewardsQuery } from '../rewards/ancGovernanceRewards';

export function useGovVoteAvailableQuery(pollId: number | undefined): boolean {
  const { data: { userGovStakingInfo } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  return useMemo(() => {
    if (!pollId || !userGovStakingInfo) return false;

    for (const [stakedPollId] of userGovStakingInfo.locked_balance) {
      if (pollId === stakedPollId) return false;
    }

    return true;
  }, [pollId, userGovStakingInfo]);
}
