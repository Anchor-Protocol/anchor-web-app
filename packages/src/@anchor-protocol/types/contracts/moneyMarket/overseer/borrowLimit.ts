import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Num } from '@anchor-protocol/types/units';

export interface BorrowLimit {
  borrow_limit: {
    borrower: HumanAddr;
    block_time?: number;
  };
}

export interface BorrowLimitResponse {
  borrower: HumanAddr;
  borrow_limit: Num;
}
