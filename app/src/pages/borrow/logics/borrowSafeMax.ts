import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

// If user_ltv >= 0.35 or user_ltv == Null:
//   SafeMax = 0
// else:
//   safemax = 0.35 * (balance - spendable) * oracle_price - loan_amount

export function borrowSafeMax(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
  bLunaSafeLtv: Ratio<BigSource>,
  currentLtv: Ratio<Big> | undefined,
): uUST<Big> {
  return !currentLtv || currentLtv.gte(bLunaSafeLtv)
    ? (big(0) as uUST<Big>)
    : (big(bLunaSafeLtv)
        .mul(big(balance).minus(spendable))
        .mul(oraclePrice)
        .minus(loanAmount) as uUST<Big>);
}
