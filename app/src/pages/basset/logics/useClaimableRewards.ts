import { uUST } from '@anchor-protocol/notation';
import { Dec, Int } from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { useMemo } from 'react';
import { Data as Claimable } from '../queries/claimable';

export function useClaimableRewards(
  claimable: Claimable | undefined,
): uUST<Big> {
  return useMemo<uUST<Big>>(() => {
    return claimable
      ? (big(
          new Int(
            new Int(claimable.claimableReward.balance).mul(
              new Dec(claimable.rewardState.global_index).sub(
                new Dec(claimable.claimableReward.index),
              ),
            ),
          )
            .add(new Int(claimable.claimableReward.pending_rewards))
            .toString(),
        ) as uUST<Big>)
      : (big(0) as uUST<Big>);
  }, [claimable]);
}
