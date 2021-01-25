import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useRepaySendAmount(
  repayAmount: UST,
  txFee: uUST<BigSource> | undefined,
): uUST<Big> | undefined {
  return useMemo(() => {
    return repayAmount.length > 0 && txFee
      ? (microfy(repayAmount).plus(txFee) as uUST<Big>)
      : undefined;
  }, [repayAmount, txFee]);
}
