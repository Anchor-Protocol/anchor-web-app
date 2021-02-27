import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uToken } from '@anchor-protocol/types/currencies';

export interface AccruedRewards {
  accrued_rewards: {
    address: HumanAddr;
  };
}

export interface AccruedRewardsResponse {
  amount: uToken; // depends on reward_denom of ConfigResponse
}
