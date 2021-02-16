import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { BigSource } from 'big.js';
import { ReactNode } from 'react';

export function validateBorrowAmount(
  borrowAmount: UST,
  max: uUST<BigSource>,
): ReactNode {
  if (borrowAmount.length === 0) {
    return undefined;
  } else if (microfy(borrowAmount).gt(max ?? 0)) {
    return `Cannot borrow more than the borrow limit.`;
  }
  return undefined;
}
