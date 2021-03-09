import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#staker
 */
export interface Staker {
  staker: {
    address: HumanAddr;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#stakerresponse
 */
export interface StakerResponse {
  balance: uANC;
  share: uANC;
  locked_balance: Array<
    [
      number, // poll_id
      {
        vote: 'yes' | 'no';
        balance: uANC;
      },
    ]
  >;
}
