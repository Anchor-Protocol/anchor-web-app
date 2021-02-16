import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { Big } from 'big.js';

export function withdrawReceiveAmount(
  withdrawAmount: UST,
  txFee: uUST<Big> | undefined,
): uUST<Big> | undefined {
  return withdrawAmount.length > 0 && txFee
    ? (microfy(withdrawAmount).minus(txFee) as uUST<Big>)
    : undefined;
}
