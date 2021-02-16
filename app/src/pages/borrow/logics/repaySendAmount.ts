import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { Big, BigSource } from 'big.js';

export function repaySendAmount(
  repayAmount: UST,
  txFee: uUST<BigSource> | undefined,
): uUST<Big> | undefined {
  return repayAmount.length > 0 && txFee
    ? (microfy(repayAmount).plus(txFee) as uUST<Big>)
    : undefined;
}
