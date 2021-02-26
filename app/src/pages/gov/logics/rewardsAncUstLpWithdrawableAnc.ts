import { Num, uANC } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function rewardsAncUstLpWithdrawableAnc(
  ancPoolSize: Num<BigSource> | undefined,
  userLpBalance: uANC<BigSource> | undefined,
  lpShare: Num<BigSource> | undefined,
): uANC<Big> | undefined {
  return ancPoolSize && userLpBalance && lpShare
    ? (big(ancPoolSize)
        .mul(userLpBalance)
        .div(lpShare === '0' ? 1 : lpShare) as uANC<Big>)
    : undefined;
}
