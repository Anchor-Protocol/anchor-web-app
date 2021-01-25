import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidBorrowAmount(
  borrowAmount: UST,
  bank: Bank,
  max: uUST<BigSource>,
): ReactNode {
  return useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || borrowAmount.length === 0) {
      return undefined;
    } else if (microfy(borrowAmount).gt(max ?? 0)) {
      return `Cannot borrow more than the borrow limit.`;
    }
    return undefined;
  }, [borrowAmount, bank.status, max]);
}
