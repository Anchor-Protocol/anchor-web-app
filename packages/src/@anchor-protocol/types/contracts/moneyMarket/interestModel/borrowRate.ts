import { uUST } from '@anchor-protocol/types/currencies';
import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/interest-model#borrowrate
 */
export interface BorrowRate {
  borrow_rate: {
    market_balance: uUST;
    total_liabilities: uUST;
    total_reserves: uUST;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/interest-model#borrowrateresponse
 */
export interface BorrowRateResponse {
  rate: Rate;
}
