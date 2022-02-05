import type { Rate, u, UST } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeLtv(
  borrowLimit: u<UST<Big>>,
  borrowedAmount: u<UST<Big>>,
): Rate<Big> {
  if (borrowLimit.lte(0)) {
    return big(0) as Rate<big>;
  }
  return borrowedAmount.div(borrowLimit) as Rate<big>;
}
