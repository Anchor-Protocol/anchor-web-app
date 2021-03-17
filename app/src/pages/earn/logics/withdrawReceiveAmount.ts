import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import { Big } from 'big.js';

export function withdrawReceiveAmount(
  withdrawAmount: UST,
  txFee: uUST<Big> | undefined,
): uUST<Big> | undefined {
  return withdrawAmount.length > 0 && txFee
    ? (microfy(withdrawAmount).minus(txFee) as uUST<Big>)
    : undefined;
}
