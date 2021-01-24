import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { Big } from 'big.js';
import { useMemo } from 'react';

export function useDepositSendAmount(
  depositAmount: UST,
  txFee: uUST<Big> | undefined,
): uUST<Big> | undefined {
  return useMemo(() => {
    return depositAmount.length > 0 && txFee
      ? (microfy(depositAmount).plus(txFee) as uUST<Big>)
      : undefined;
  }, [depositAmount, txFee]);
}
