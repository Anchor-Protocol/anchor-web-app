import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { BorrowerResponse } from '@anchor-protocol/types/contracts/moneyMarket/custody/borrower';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#borrowers
 */
export interface Borrowers {
  borrowers: {
    start_after?: HumanAddr;
    limit?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#borrowersresponse
 */
export interface BorrowersResponse {
  borrowers: Array<BorrowerResponse>;
}
