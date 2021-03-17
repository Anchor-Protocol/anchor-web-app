import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import { Big } from 'big.js';

export function depositSendAmount(
  depositAmount: UST,
  txFee: uUST<Big> | undefined,
): uUST<Big> | undefined {
  return depositAmount.length > 0 && txFee
    ? (microfy(depositAmount).plus(txFee) as uUST<Big>)
    : undefined;
}
