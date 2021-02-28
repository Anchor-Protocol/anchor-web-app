import type { uANC, uUST } from '@anchor-protocol/types';
import { cw20 } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { AncPrice } from 'pages/gov/models/ancPrice';

export function rewardsAncUstLpWithdrawableUst(
  ancPrice: AncPrice | undefined,
  ancBalance: cw20.BalanceResponse<uANC> | undefined,
): uUST<Big> | undefined {
  return ancPrice && ancBalance
    ? (big(ancPrice.USTPoolSize)
        .mul(ancBalance.balance)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as uUST<Big>)
    : undefined;
}
