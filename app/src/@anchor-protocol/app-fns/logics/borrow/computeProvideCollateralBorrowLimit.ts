import type { bAsset, u, UST } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

// New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice) * Max_LTV

export function computeProvideCollateralBorrowLimit(
  depositAmount: u<bAsset>,
  amountToBorrowLimit: (depositAmount: u<bAsset<BigSource>>) => u<UST<Big>>,
): u<UST<Big>> {
  return depositAmount.length > 0
    ? amountToBorrowLimit(depositAmount)
    : (Big(0) as u<UST<Big>>);
}
