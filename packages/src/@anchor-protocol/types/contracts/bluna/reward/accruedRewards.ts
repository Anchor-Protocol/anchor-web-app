import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uToken } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#accruedrewards
 */
export interface AccruedRewards {
  accrued_rewards: {
    address: HumanAddr;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#accruedrewardsresponse
 */
export interface AccruedRewardsResponse {
  amount: uToken; // depends on reward_denom of ConfigResponse
}
