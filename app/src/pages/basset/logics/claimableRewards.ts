import { Num, ubLuna, uUST } from '@anchor-protocol/notation';
import { Dec, Int } from '@terra-money/terra.js';
import big, { Big } from 'big.js';

export function claimableRewards(
  balance: ubLuna | undefined,
  global_index: Num | undefined,
  index: Num | undefined,
  pending_rewards: ubLuna | undefined,
): uUST<Big> {
  return balance && global_index && index && pending_rewards
    ? (big(
        new Int(new Int(balance).mul(new Dec(global_index).sub(new Dec(index))))
          .add(new Int(pending_rewards))
          .toString(),
      ) as uUST<Big>)
    : (big(0) as uUST<Big>);
}
