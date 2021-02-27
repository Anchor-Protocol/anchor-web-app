import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { ubLuna, uToken } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

export interface Holder {
  holder: {
    address: HumanAddr;
  };
}

export interface HolderResponse {
  address: HumanAddr;
  balance: ubLuna;
  index: Num;
  pending_rewards: uToken; // depends on reward_denom of ConfigResponse
}
