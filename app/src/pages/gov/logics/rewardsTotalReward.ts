import type { uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function rewardsTotalReward(
  borrowerAncReward: uUST<BigSource> | undefined,
  ancUstLpReward: uUST<BigSource> | undefined,
): uUST<Big> | undefined {
  return borrowerAncReward && ancUstLpReward
    ? (big(borrowerAncReward).plus(ancUstLpReward) as uUST<Big>)
    : undefined;
}
