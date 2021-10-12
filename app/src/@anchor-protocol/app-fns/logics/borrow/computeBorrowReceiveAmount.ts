import type { u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { Big, BigSource } from 'big.js';

export function computeBorrowReceiveAmount(
  borrowAmount: UST,
  txFee: u<UST<BigSource>> | undefined,
): u<UST<Big>> | undefined {
  return borrowAmount.length > 0 && txFee
    ? (microfy(borrowAmount).minus(txFee) as u<UST<Big>>)
    : undefined;
}
