import { moneyMarket } from '@anchor-protocol/types';
import type { Rate, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const repayAmountToLtv = (
  borrowInfo: moneyMarket.market.BorrowerInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
) => (repayAmount: uUST<BigSource>): Rate<Big> => {
  return big(big(borrowInfo.loan_amount).minus(repayAmount)).div(
    big(big(borrower.balance).minus(borrower.spendable)).mul(oracle.rate),
  ) as Rate<Big>;
};
