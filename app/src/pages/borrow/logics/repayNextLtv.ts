import { microfy, Ratio, UST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

// (Loan_amount - repay_amount) / ((Borrow_info.balance - Borrow_info.spendable) * Oracleprice)

export function repayNextLtv(
  repayAmount: UST,
  currentLtv: Ratio<Big> | undefined,
  repayAmountToLtv: (repayAmount: uUST<BigSource>) => Ratio<Big>,
): Ratio<Big> | undefined {
  if (repayAmount.length === 0) {
    return currentLtv;
  }

  const amount = microfy(repayAmount);

  try {
    const ltv = repayAmountToLtv(amount);
    return ltv.lt(0) ? (big(0) as Ratio<Big>) : ltv;
  } catch {
    return currentLtv;
  }
}
