import { bLuna, microfy, Ratio, ubLuna } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

// Loan_amount / ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice)

export function provideCollateralNextLtv(
  depositAmount: bLuna,
  currentLtv: Ratio<Big> | undefined,
  depositAmountToLtv: (depositAmount: ubLuna<BigSource>) => Ratio<Big>,
): Ratio<Big> | undefined {
  if (depositAmount.length === 0) {
    return currentLtv;
  }

  const amount = microfy(depositAmount);

  try {
    const ltv = depositAmountToLtv(amount);
    return ltv.lt(0) ? (big(0) as Ratio<Big>) : ltv;
  } catch {
    return currentLtv;
  }
}
