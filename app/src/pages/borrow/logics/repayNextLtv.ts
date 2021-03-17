import { microfy } from '@anchor-protocol/notation';
import type { Rate, UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// (Loan_amount - repay_amount) / ((Borrow_info.balance - Borrow_info.spendable) * Oracleprice)

export function repayNextLtv(
  repayAmount: UST,
  currentLtv: Rate<Big> | undefined,
  repayAmountToLtv: (repayAmount: uUST<BigSource>) => Rate<Big>,
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
