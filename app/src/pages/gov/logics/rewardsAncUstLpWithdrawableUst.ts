import type { Num, uANC, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function rewardsAncUstLpWithdrawableUst(
  ustPoolSize: Num<BigSource> | undefined,
  userLpBalance: uANC<BigSource> | undefined,
  lpShare: Num<BigSource> | undefined,
): uUST<Big> | undefined {
  return ustPoolSize && userLpBalance && lpShare
    ? (big(ustPoolSize)
        .mul(userLpBalance)
        .div(lpShare === '0' ? 1 : lpShare) as uUST<Big>)
    : undefined;
}
