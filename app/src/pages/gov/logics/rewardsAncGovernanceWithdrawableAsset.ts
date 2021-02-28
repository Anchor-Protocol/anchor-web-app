import type { uANC } from '@anchor-protocol/types';
import { anchorToken, cw20 } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function rewardsAncGovernanceWithdrawableAsset(
  govANCBalance: cw20.BalanceResponse<uANC> | undefined,
  govState: anchorToken.gov.StateResponse | undefined,
  govStaker: anchorToken.gov.StakerResponse | undefined,
): uANC<Big> | undefined {
  if (govANCBalance && govState && govStaker) {
    return big(
      big(big(govANCBalance.balance).minus(govState.total_deposit)).div(
        govState.total_share === '0' ? 1 : govState.total_share,
      ),
    ).mul(govStaker.share) as uANC<Big>;
  }

  return undefined;
}
