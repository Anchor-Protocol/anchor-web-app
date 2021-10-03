import type { Rate, u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import big, { Big, BigSource } from 'big.js';

// (Loan_amount + borrow_amount) / ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice)

export function computeBorrowNextLtv(
  borrowAmount: UST,
  currentLtv: Rate<Big> | undefined,
  borrowAmountToLtv: (borrowAmount: u<UST<BigSource>>) => Rate<Big>,
): Rate<Big> | undefined {
  if (borrowAmount.length === 0) {
    return currentLtv;
  }

  const amount = microfy(borrowAmount);

  try {
    const ltv = borrowAmountToLtv(amount);
    return ltv.lt(0) ? (big(0) as Rate<Big>) : ltv;
  } catch {
    return currentLtv;
  }
}
