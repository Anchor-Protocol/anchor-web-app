import type { uUST } from '@anchor-protocol/types';
import { bluna } from '@anchor-protocol/types';
import { Dec, Int } from '@terra-money/terra.js';
import big, { Big } from 'big.js';

export function claimableRewards(
  holder: bluna.reward.HolderResponse | undefined,
  state: bluna.reward.StateResponse | undefined,
): uUST<Big> {
  return holder && state
    ? (big(
        new Int(
          new Int(holder.balance).mul(
            new Dec(state.global_index).sub(new Dec(holder.index)),
          ),
        )
          .add(new Int(holder.pending_rewards))
          .toString(),
      ) as uUST<Big>)
    : (big(0) as uUST<Big>);
}
