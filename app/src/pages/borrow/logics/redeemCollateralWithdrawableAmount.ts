import type { Rate, ubLuna, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// If user_ltv >= 0.35 or user_ltv == Null:
//   withdrawable = borrow_info.spendable
// else:
//   withdrawable = borrow_info.balance - borrow_info.loan_amount / 0.35 / oracle_price

export function redeemCollateralWithdrawableAmount(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
  bLunaSafeLtv: Rate<BigSource>,
  bLunaMaxLtv: Rate<BigSource>,
  nextLtv: Rate<Big> | undefined,
): ubLuna<Big> {
  const withdrawable =
    !nextLtv || nextLtv.gte(bLunaMaxLtv)
      ? big(spendable)
      : big(balance).minus(big(loanAmount).div(bLunaSafeLtv).div(oraclePrice));

  return (withdrawable.lt(0) ? big(0) : withdrawable) as ubLuna<Big>;
}
