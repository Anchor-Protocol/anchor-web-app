import type { Rate, ubLuna } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const redeemAmountToLtv = (
  borrowInfo: moneyMarket.market.BorrowInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
) => (redeemAmount: ubLuna<BigSource>): Rate<Big> => {
  return big(borrowInfo.loan_amount).div(
    big(
      big(borrower.balance).minus(borrower.spendable).minus(redeemAmount),
    ).mul(oracle.rate),
  ) as Rate<Big>;
};
