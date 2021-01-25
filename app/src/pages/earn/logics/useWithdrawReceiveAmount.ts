import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { Big } from 'big.js';
import { useMemo } from 'react';

export function useWithdrawReceiveAmount(
  withdrawAmount: UST,
  txFee: uUST<Big> | undefined,
): uUST<Big> | undefined {
  return useMemo<uUST<Big> | undefined>(() => {
    return withdrawAmount.length > 0 && txFee
      ? (microfy(withdrawAmount).minus(txFee) as uUST<Big>)
      : undefined;
  }, [withdrawAmount, txFee]);
}
