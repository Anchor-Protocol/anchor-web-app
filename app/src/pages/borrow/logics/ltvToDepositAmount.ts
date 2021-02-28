import type { Rate, ubLuna } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// ltv = loanAmount / ((balance - spendable + <amount>) * oracle)
// amount = (loanAmount / (<ltv> * oracle)) + spendable - balance

export const ltvToDepositAmount = (
  borrowInfo: moneyMarket.market.BorrowInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
) => (ltv: Rate<BigSource>): ubLuna<Big> => {
  return big(big(borrowInfo.loan_amount).div(big(ltv).mul(oracle.rate)))
    .plus(borrower.spendable)
    .minus(borrower.balance) as ubLuna<Big>;
};
