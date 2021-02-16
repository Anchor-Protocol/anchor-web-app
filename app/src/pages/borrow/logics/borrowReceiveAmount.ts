import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { Big, BigSource } from 'big.js';

export function borrowReceiveAmount(
  borrowAmount: UST,
  txFee: uUST<BigSource> | undefined,
): uUST<Big> | undefined {
  return borrowAmount.length > 0 && txFee
    ? (microfy(borrowAmount).minus(txFee) as uUST<Big>)
    : undefined;
}
