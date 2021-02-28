import type { uANC } from '@anchor-protocol/types';
import { cw20 } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { AncPrice } from 'pages/gov/models/ancPrice';

export function rewardsAncUstLpWithdrawableAnc(
  ancPrice: AncPrice | undefined,
  ancBalance: cw20.BalanceResponse<uANC> | undefined,
): uANC<Big> | undefined {
  return ancPrice && ancBalance
    ? (big(ancPrice.ANCPoolSize)
        .mul(ancBalance.balance)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as uANC<Big>)
    : undefined;
}
