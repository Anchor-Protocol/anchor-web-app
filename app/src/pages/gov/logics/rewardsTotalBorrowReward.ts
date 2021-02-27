import type { Num, uANC, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function rewardsTotalBorrowReward(
  global_reward_index: Num<BigSource> | undefined,
  reward_index: Num<BigSource> | undefined,
  pending_rewards: uANC<BigSource> | undefined,
): uUST<Big> | undefined {
  return global_reward_index && reward_index && pending_rewards
    ? (big(global_reward_index)
        .minus(reward_index)
        .plus(pending_rewards) as uUST<Big>)
    : undefined;
}
