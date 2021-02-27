import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

export interface Staker {
  staker: {
    address: HumanAddr;
  };
}

export interface StakerResponse {
  balance: uANC;
  share: uANC;
  locked_balance: Array<
    [
      number,
      {
        vote: 'yes' | 'no';
        balance: uANC;
      },
    ]
  >;
}
