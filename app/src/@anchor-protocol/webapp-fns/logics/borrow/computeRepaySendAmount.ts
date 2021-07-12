import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

export function computeRepaySendAmount(
  repayAmount: UST,
  txFee: uUST<BigSource> | undefined,
): uUST<Big> | undefined {
  return repayAmount.length > 0 && txFee
    ? (microfy(repayAmount).plus(txFee) as uUST<Big>)
    : undefined;
}
