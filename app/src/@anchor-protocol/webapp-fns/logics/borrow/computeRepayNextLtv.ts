import type { Rate, u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import big, { Big, BigSource } from 'big.js';

// (Loan_amount - repay_amount) / ((Borrow_info.balance - Borrow_info.spendable) * Oracleprice)

export function computeRepayNextLtv(
  repayAmount: UST,
  currentLtv: Rate<Big> | undefined,
  repayAmountToLtv: (repayAmount: u<UST<BigSource>>) => Rate<Big>,
): Rate<Big> | undefined {
  if (repayAmount.length === 0) {
    return currentLtv;
  }

  const amount = microfy(repayAmount);

  try {
    const ltv = repayAmountToLtv(amount);
    return ltv.lt(0) ? (big(0) as Rate<Big>) : ltv;
  } catch {
    return currentLtv;
  }
}
