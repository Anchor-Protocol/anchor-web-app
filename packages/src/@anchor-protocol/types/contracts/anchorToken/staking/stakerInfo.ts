import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#stakerinfo
 */
export interface StakerInfo {
  staker_info: {
    staker: HumanAddr;
    block_height?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#stakerinforesponse
 */
export interface StakerInfoResponse {
  staker: HumanAddr;
  reward_index: Num;
  bond_amount: uANC;
  pending_rewards: uANC;
}
