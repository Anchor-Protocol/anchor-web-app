import { uANC, uUST } from '../../../currencies';
import { Num } from '../../../units';
import { HumanAddr } from '../../common';

export interface BorrowInfo {
  borrower_info: {
    borrower: HumanAddr;
    block_height?: number;
  };
}

export interface BorrowInfoResponse {
  borrower: HumanAddr;
  interest_index: Num;
  reward_index: Num;
  loan_amount: uUST;
  pending_rewards: uANC;
}
