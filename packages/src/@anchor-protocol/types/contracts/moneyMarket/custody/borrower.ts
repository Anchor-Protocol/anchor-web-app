import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uUST } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#borrower
 */
export interface Borrower {
  borrower: {
    address: HumanAddr;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#borrowerresponse
 */
export interface BorrowerResponse {
  borrower: HumanAddr;
  balance: uUST;
  spendable: uUST;
}
