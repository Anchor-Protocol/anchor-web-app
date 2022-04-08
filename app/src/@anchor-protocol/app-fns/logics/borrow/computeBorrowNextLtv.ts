import type { Rate, u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import big, { Big } from 'big.js';
import { computeBorrowAmountToLtv } from './computeBorrowAmountToLtv';

// (Loan_amount + borrow_amount) / ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice)

export function computeBorrowNextLtv(
  amount: UST,
  borrowLimit: u<UST<Big>>,
  borrowedAmount: u<UST<Big>>,
): Rate<Big> | undefined {
  if (amount.length === 0) {
    return undefined;
  }
  try {
    const ltv = computeBorrowAmountToLtv(
      microfy(amount),
      borrowLimit,
      borrowedAmount,
    );
    return ltv.lt(0) ? (big(0) as Rate<Big>) : ltv;
  } catch {
    return undefined;
  }
}
