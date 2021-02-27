import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { ubLuna, uToken } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#holder
 */
export interface Holder {
  holder: {
    address: HumanAddr;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#holderresponse
 */
export interface HolderResponse {
  address: HumanAddr;
  balance: ubLuna;
  index: Num;
  pending_rewards: uToken; // depends on reward_denom of ConfigResponse
}
