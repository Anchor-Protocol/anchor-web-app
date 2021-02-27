import { uANC, uUST } from '../../../currencies';
import { Num } from '../../../units';
import { HumanAddr } from '../../common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#borrowerinfo
 */
export interface BorrowInfo {
  borrower_info: {
    borrower: HumanAddr;
    block_height?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#borrowerinforesponse
 */
export interface BorrowInfoResponse {
  borrower: HumanAddr;
  interest_index: Num;
  reward_index: Num;
  loan_amount: uUST;
  pending_rewards: uANC;
}
