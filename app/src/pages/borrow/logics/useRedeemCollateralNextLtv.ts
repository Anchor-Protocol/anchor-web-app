import { bLuna, microfy, Ratio, ubLuna } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

// Loan_amount / ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice)

export function useRedeemCollateralNextLtv(
  redeemAmount: bLuna,
  currentLtv: Ratio<Big> | undefined,
  redeemAmountToLtv: (redeemAmount: ubLuna<BigSource>) => Ratio<Big>,
): Ratio<Big> | undefined {
  if (redeemAmount.length === 0) {
    return currentLtv;
  }

  const amount = microfy(redeemAmount);

  try {
    const ltv = redeemAmountToLtv(amount);
    return ltv.lt(0) ? (big(0) as Ratio<Big>) : ltv;
  } catch {
    return currentLtv;
  }
}
