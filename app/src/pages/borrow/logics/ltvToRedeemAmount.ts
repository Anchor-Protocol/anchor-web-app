import type { Rate, ubLuna } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const ltvToRedeemAmount = (
  borrowInfo: moneyMarket.market.BorrowerInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
) => (ltv: Rate<BigSource>) => {
  return big(borrower.balance).minus(
    big(borrowInfo.loan_amount).div(big(ltv).mul(oracle.rate)),
  ) as ubLuna<Big>;
};
