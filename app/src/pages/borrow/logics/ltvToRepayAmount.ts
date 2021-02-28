import type { Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const ltvToRepayAmount = (
  borrowInfo: moneyMarket.market.BorrowInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
) => (ltv: Rate<BigSource>): uUST<Big> => {
  return big(borrowInfo.loan_amount).minus(
    big(ltv).mul(
      big(big(borrower.balance).minus(borrower.spendable)).mul(oracle.rate),
    ),
  ) as uUST<Big>;
};
