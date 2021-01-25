import { bLuna, microfy, ubLuna, uUST } from '@anchor-protocol/notation';
import { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

// New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice) * Max_LTV

export function useProvideCollateralBorrowLimit(
  depositAmount: bLuna,
  amountToBorrowLimit: (depositAmount: ubLuna<BigSource>) => uUST<Big>,
): uUST<Big> | undefined {
  return useMemo(() => {
    return depositAmount.length > 0
      ? amountToBorrowLimit(microfy(depositAmount))
      : undefined;
  }, [amountToBorrowLimit, depositAmount]);
}
