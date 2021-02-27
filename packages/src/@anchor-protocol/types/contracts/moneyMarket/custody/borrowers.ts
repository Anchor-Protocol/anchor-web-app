import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { BorrowerResponse } from '@anchor-protocol/types/contracts/moneyMarket/custody/borrower';

export interface Borrowers {
  borrowers: {
    start_after?: HumanAddr;
    limit?: number;
  };
}

export interface BorrowersResponse {
  borrowers: Array<BorrowerResponse>;
}
