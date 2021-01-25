import { microfy, Ratio, UST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

// (Loan_amount + borrow_amount) / ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice)

export function useBorrowNextLtv(
  borrowAmount: UST,
  currentLtv: Ratio<Big> | undefined,
  borrowAmountToLtv: (borrowAmount: uUST<BigSource>) => Ratio<Big>,
): Ratio<Big> | undefined {
  return useMemo<Ratio<Big> | undefined>(() => {
    if (borrowAmount.length === 0) {
      return currentLtv;
    }

    const amount = microfy(borrowAmount);

    try {
      const ltv = borrowAmountToLtv(amount);
      return ltv.lt(0) ? (big(0) as Ratio<Big>) : ltv;
    } catch {
      return currentLtv;
    }
  }, [borrowAmountToLtv, borrowAmount, currentLtv]);
}
