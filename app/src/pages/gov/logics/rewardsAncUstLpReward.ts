import type { uUST } from '@anchor-protocol/types';
import { anchorToken } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function rewardsAncUstLpReward(
  stakingState: anchorToken.staking.StateResponse | undefined,
  stakerInfo: anchorToken.staking.StakerInfoResponse | undefined,
): uUST<Big> | undefined {
  if (stakingState && stakerInfo) {
    return big(
      big(stakingState.global_reward_index).minus(stakerInfo.reward_index),
    )
      .mul(stakerInfo.bond_amount)
      .plus(stakerInfo.pending_rewards) as uUST<Big>;
  }

  return undefined;
}
