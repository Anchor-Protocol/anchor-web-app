import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

export interface StakerInfo {
  staker_info: {
    staker: HumanAddr;
    block_height?: number;
  };
}

export interface StakerInfoResponse {
  staker: HumanAddr;
  reward_index: Num;
  bond_amount: uANC;
  pending_rewards: uANC;
}
