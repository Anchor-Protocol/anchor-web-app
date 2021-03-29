import type { Rate, ubLuna } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// maxAmount = balance - (loan_amount / bLunaMaxLtv / oraclePrice)

export function redeemCollateralMaxAmount(
  borrowInfo: moneyMarket.market.BorrowerInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
  bLunaMaxLtv: Rate<BigSource>,
): ubLuna<Big> {
  const withdrawable = big(borrower.balance).minus(
    big(borrowInfo.loan_amount).div(bLunaMaxLtv).div(oracle.rate),
  );
  return (withdrawable.lt(0) ? big(0) : withdrawable) as ubLuna<Big>;
}
