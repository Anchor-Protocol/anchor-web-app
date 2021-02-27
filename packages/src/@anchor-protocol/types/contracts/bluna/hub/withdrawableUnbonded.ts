import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uLuna } from '@anchor-protocol/types/currencies';

export interface WithdrawableUnbonded {
  withdrawable_unbonded: {
    address: HumanAddr;
    block_time: number;
  };
}

export interface WithdrawableUnbondedResponse {
  withdrawable: uLuna;
}
