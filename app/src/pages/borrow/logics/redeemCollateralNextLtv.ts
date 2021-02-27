import { microfy } from '@anchor-protocol/notation';
import type { bLuna, Rate, ubLuna } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// Loan_amount / ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice)

export function redeemCollateralNextLtv(
  redeemAmount: bLuna,
  currentLtv: Rate<Big> | undefined,
  redeemAmountToLtv: (redeemAmount: ubLuna<BigSource>) => Rate<Big>,
): Rate<Big> | undefined {
  if (redeemAmount.length === 0) {
    return currentLtv;
  }

  const amount = microfy(redeemAmount);

  try {
    const ltv = redeemAmountToLtv(amount);
    return ltv.lt(0) ? (big(0) as Rate<Big>) : ltv;
  } catch {
    return currentLtv;
  }
}
