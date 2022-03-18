import type { bAsset, Rate, u } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// Loan_amount / ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice)

export function computeProvideCollateralNextLtv(
  depositAmount: u<bAsset<string>>,
  currentLtv: Rate<Big> | undefined,
  depositAmountToLtv: (depositAmount: u<bAsset<BigSource>>) => Rate<Big>,
): Rate<Big> | undefined {
  if (depositAmount.length === 0) {
    return currentLtv;
  }
  try {
    const ltv = depositAmountToLtv(depositAmount);
    return ltv.lt(0) ? (big(0) as Rate<Big>) : ltv;
  } catch {
    return currentLtv;
  }
}
