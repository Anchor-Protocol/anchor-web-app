import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uUST } from '@anchor-protocol/types/currencies';

export interface Borrower {
  borrower: {
    address: HumanAddr;
  };
}

export interface BorrowerResponse {
  borrower: HumanAddr;
  balance: uUST;
  spendable: uUST;
}
