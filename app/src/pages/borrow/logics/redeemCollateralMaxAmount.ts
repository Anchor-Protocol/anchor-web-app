import type { Rate, ubLuna, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// maxAmount = balance - (loan_amount / bLunaMaxLtv / oraclePrice)

export function redeemCollateralMaxAmount(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
  bLunaMaxLtv: Rate<BigSource>,
): ubLuna<Big> {
  const withdrawable = big(balance).minus(
    big(loanAmount).div(bLunaMaxLtv).div(oraclePrice),
  );
  return (withdrawable.lt(0) ? big(0) : withdrawable) as ubLuna<Big>;
}
