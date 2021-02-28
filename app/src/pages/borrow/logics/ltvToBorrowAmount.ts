import type { Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const ltvToBorrowAmount = (
  borrowInfo: moneyMarket.market.BorrowInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
) => (ltv: Rate<BigSource>): uUST<Big> => {
  return big(ltv)
    .mul(big(borrower.balance).minus(borrower.spendable).mul(oracle.rate))
    .minus(borrowInfo.loan_amount) as uUST<Big>;
};
