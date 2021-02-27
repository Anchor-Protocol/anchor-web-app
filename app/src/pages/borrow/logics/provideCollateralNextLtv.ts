import { microfy } from '@anchor-protocol/notation';
import type { bLuna, Rate, ubLuna } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// Loan_amount / ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice)

export function provideCollateralNextLtv(
  depositAmount: bLuna,
  currentLtv: Rate<Big> | undefined,
  depositAmountToLtv: (depositAmount: ubLuna<BigSource>) => Rate<Big>,
): Rate<Big> | undefined {
  if (depositAmount.length === 0) {
    return currentLtv;
  }

  const amount = microfy(depositAmount);

  try {
    const ltv = depositAmountToLtv(amount);
    return ltv.lt(0) ? (big(0) as Rate<Big>) : ltv;
  } catch {
    return currentLtv;
  }
}
