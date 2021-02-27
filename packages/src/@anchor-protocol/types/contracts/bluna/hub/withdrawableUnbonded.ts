import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uLuna } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#withdrawableunbonded
 */
export interface WithdrawableUnbonded {
  withdrawable_unbonded: {
    address: HumanAddr;
    block_time: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#withdrawableunbondedresponse
 */
export interface WithdrawableUnbondedResponse {
  withdrawable: uLuna;
}
