import { microfy } from '@anchor-protocol/notation';
import type { bLuna, ubLuna, uUST } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

// New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice) * Max_LTV

export function provideCollateralBorrowLimit(
  depositAmount: bLuna,
  amountToBorrowLimit: (depositAmount: ubLuna<BigSource>) => uUST<Big>,
): uUST<Big> | undefined {
  return depositAmount.length > 0
    ? amountToBorrowLimit(microfy(depositAmount))
    : undefined;
}
