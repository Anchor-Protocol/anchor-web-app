import { Num } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function rewardsAncUstLpReward(
  global_reward_index: Num<BigSource> | undefined,
  reward_index: Num<BigSource> | undefined,
  bond_amount: Num<BigSource> | undefined,
  pending_reward: Num<BigSource> | undefined,
): Num<Big> | undefined {
  if (global_reward_index && reward_index && bond_amount && pending_reward) {
    return big(big(global_reward_index).minus(reward_index))
      .mul(bond_amount)
      .plus(pending_reward) as Num<Big>;
  }

  return undefined;
}
