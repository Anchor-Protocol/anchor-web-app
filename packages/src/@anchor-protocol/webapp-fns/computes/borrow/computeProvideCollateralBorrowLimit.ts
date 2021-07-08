import { microfy } from '@anchor-protocol/notation';
import type { bAsset, ubAsset, uUST } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

// New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice) * Max_LTV

export function computeProvideCollateralBorrowLimit(
  depositAmount: bAsset,
  amountToBorrowLimit: (depositAmount: ubAsset<BigSource>) => uUST<Big>,
): uUST<Big> | undefined {
  return depositAmount.length > 0
    ? amountToBorrowLimit(microfy(depositAmount))
    : undefined;
}
