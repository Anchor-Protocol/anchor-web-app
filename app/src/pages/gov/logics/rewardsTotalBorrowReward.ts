import type { uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function rewardsTotalBorrowReward(
  marketState: moneyMarket.market.StateResponse | undefined,
  borrowInfo: moneyMarket.market.BorrowInfoResponse | undefined,
): uUST<Big> | undefined {
  return borrowInfo && marketState
    ? (big(marketState.global_reward_index)
        .minus(borrowInfo.reward_index)
        .plus(borrowInfo.pending_rewards) as uUST<Big>)
    : undefined;
}
