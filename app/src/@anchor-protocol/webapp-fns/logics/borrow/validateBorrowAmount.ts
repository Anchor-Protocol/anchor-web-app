import type { u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { BigSource } from 'big.js';
import { ReactNode } from 'react';

export function validateBorrowAmount(
  borrowAmount: UST,
  max: u<UST<BigSource>>,
): ReactNode {
  if (borrowAmount.length === 0) {
    return undefined;
  } else if (microfy(borrowAmount).gt(max ?? 0)) {
    return `Cannot borrow more than the borrow limit.`;
  }
  return undefined;
}
