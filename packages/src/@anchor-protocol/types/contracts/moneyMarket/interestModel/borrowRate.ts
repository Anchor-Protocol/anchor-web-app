import { uUST } from '@anchor-protocol/types/currencies';
import { Rate } from '@anchor-protocol/types/units';

export interface BorrowRate {
  borrow_rate: {
    market_balance: uUST;
    total_liabilities: uUST;
    total_reserves: uUST;
  };
}

export interface BorrowRateResponse {
  rate: Rate;
}
