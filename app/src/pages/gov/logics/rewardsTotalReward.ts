import type { uANC } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function rewardsTotalReward(
  borrowerAncReward: uANC<BigSource> | undefined,
  ancUstLpReward: uANC<BigSource> | undefined,
): uANC<Big> | undefined {
  return borrowerAncReward && ancUstLpReward
    ? (big(borrowerAncReward).plus(ancUstLpReward) as uANC<Big>)
    : undefined;
}
