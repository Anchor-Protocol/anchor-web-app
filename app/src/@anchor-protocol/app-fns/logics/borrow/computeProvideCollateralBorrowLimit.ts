import type { bAsset, u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { Big, BigSource } from 'big.js';

// New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice) * Max_LTV

export function computeProvideCollateralBorrowLimit(
  depositAmount: bAsset,
  amountToBorrowLimit: (depositAmount: u<bAsset<BigSource>>) => u<UST<Big>>,
): u<UST<Big>> {
  return depositAmount.length > 0
    ? amountToBorrowLimit(microfy(depositAmount))
    : (Big(0) as u<UST<Big>>);
}
