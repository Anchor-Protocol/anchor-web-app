import type { bAsset, Rate, u } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// Loan_amount / ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice)

export function computeRedeemCollateralNextLtv(
  redeemAmount: u<bAsset>,
  currentLtv: Rate<Big> | undefined,
  redeemAmountToLtv: (redeemAmount: u<bAsset<BigSource>>) => Rate<Big>,
): Rate<Big> | undefined {
  if (redeemAmount.length === 0) {
    return currentLtv;
  }
  try {
    const ltv = redeemAmountToLtv(redeemAmount);
    return ltv.lt(0) ? (big(0) as Rate<Big>) : ltv;
  } catch {
    return currentLtv;
  }
}
