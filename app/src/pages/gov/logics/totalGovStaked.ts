import type { uANC } from '@anchor-protocol/types';
import { anchorToken, cw20 } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function totalGovStaked(
  govANCBalance: cw20.BalanceResponse<uANC> | undefined,
  govState: anchorToken.gov.StateResponse | undefined,
): uANC<Big> | undefined {
  return govANCBalance && govState
    ? (big(govANCBalance.balance).minus(govState.total_deposit) as uANC<Big>)
    : undefined;
}
