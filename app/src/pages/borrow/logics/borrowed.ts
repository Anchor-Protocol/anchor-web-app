import type { uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function borrowed(loanAmount: uUST<BigSource> | undefined): uUST<Big> {
  return big(loanAmount ?? 0) as uUST<Big>;
}
