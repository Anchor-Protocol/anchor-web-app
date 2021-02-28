import type { uANC } from '@anchor-protocol/types';
import { cw20 } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function rewardsAncGovernanceStakable(
  ancBalance: cw20.BalanceResponse<uANC> | undefined,
): uANC<Big> | undefined {
  return ancBalance ? (big(ancBalance.balance) as uANC<Big>) : undefined;
}
