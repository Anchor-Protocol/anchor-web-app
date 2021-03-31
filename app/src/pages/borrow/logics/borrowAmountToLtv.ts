import type { Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const borrowAmountToLtv = (
  borrowInfo: moneyMarket.market.BorrowerInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
) => (borrowAmount: uUST<BigSource>): Rate<Big> => {
  return big(big(borrowInfo.loan_amount).plus(borrowAmount)).div(
    big(big(borrower.balance).minus(borrower.spendable)).mul(oracle.rate),
  ) as Rate<Big>;
};
