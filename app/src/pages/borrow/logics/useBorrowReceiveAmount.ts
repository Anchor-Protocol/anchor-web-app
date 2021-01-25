import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useBorrowReceiveAmount(
  borrowAmount: UST,
  txFee: uUST<BigSource> | undefined,
): uUST<Big> | undefined {
  return useMemo(() => {
    return borrowAmount.length > 0 && txFee
      ? (microfy(borrowAmount).minus(txFee) as uUST<Big>)
      : undefined;
  }, [borrowAmount, txFee]);
}
