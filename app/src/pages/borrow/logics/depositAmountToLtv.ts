import type { Rate, ubLuna } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const depositAmountToLtv = (
  borrowInfo: moneyMarket.market.BorrowerInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
) => (depositAmount: ubLuna<BigSource>): Rate<Big> => {
  return big(borrowInfo.loan_amount).div(
    big(
      big(borrower.balance).minus(borrower.spendable).plus(depositAmount),
    ).mul(oracle.rate),
  ) as Rate<Big>;
};
