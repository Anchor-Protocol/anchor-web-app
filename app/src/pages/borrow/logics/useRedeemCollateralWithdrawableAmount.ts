import { Ratio, ubLuna, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

// If user_ltv >= 0.35 or user_ltv == Null:
//   withdrawable = borrow_info.spendable
// else:
//   withdrawable = borrow_info.balance - borrow_info.loan_amount / 0.35 / oracle_price

export function useRedeemCollateralWithdrawableAmount(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
  bLunaSafeLtv: Ratio<BigSource>,
  bLunaMaxLtv: Ratio<BigSource>,
  nextLtv: Ratio<Big> | undefined,
): ubLuna<Big> {
  const withdrawable =
    !nextLtv || nextLtv.gte(bLunaMaxLtv)
      ? big(spendable)
      : big(balance).minus(big(loanAmount).div(bLunaSafeLtv).div(oraclePrice));

  return (withdrawable.lt(0) ? big(0) : withdrawable) as ubLuna<Big>;
}
