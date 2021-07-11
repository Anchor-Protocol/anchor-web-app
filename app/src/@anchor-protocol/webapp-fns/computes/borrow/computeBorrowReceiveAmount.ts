import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

export function computeBorrowReceiveAmount(
  borrowAmount: UST,
  txFee: uUST<BigSource> | undefined,
): uUST<Big> | undefined {
  return borrowAmount.length > 0 && txFee
    ? (microfy(borrowAmount).minus(txFee) as uUST<Big>)
    : undefined;
}
