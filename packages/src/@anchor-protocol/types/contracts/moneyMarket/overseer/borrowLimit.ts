import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Num } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#borrowlimit
 */
export interface BorrowLimit {
  borrow_limit: {
    borrower: HumanAddr;
    block_time?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#borrowlimitresponse
 */
export interface BorrowLimitResponse {
  borrower: HumanAddr;
  borrow_limit: Num;
}
