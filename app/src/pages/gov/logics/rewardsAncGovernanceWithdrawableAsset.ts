import { Num, uANC } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function rewardsAncGovernanceWithdrawableAsset(
  ancBalance: uANC<BigSource> | undefined,
  total_deposit: uANC<BigSource> | undefined,
  total_share: uANC<BigSource> | undefined,
  share: Num<BigSource> | undefined,
): uANC<Big> | undefined {
  if (ancBalance && total_deposit && total_share && share) {
    return big(
      big(big(ancBalance).minus(total_deposit)).div(
        total_share === '0' ? 1 : total_share,
      ),
    ).mul(share) as uANC<Big>;
  }

  return undefined;
}
