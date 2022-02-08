import type { u, UST } from '@anchor-protocol/types';
import { Big } from 'big.js';

export function computeBorrowMax(
  borrowLimit: u<UST<Big>>,
  borrowedAmount: u<UST<Big>>,
): u<UST<Big>> {
  return borrowLimit.minus(borrowedAmount) as u<UST<Big>>;
}
