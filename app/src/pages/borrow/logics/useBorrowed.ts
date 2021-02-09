import { uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useBorrowed(
  loanAmount: uUST<BigSource> | undefined,
): uUST<Big> {
  return useMemo(() => {
    return big(loanAmount ?? 0) as uUST<Big>;
  }, [loanAmount]);
}
