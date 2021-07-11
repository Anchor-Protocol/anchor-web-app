import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import { BigSource } from 'big.js';
import { ReactNode } from 'react';

export function validateRepayAmount(
  repayAmount: UST,
  ustBalance: uUST<BigSource>,
): ReactNode {
  if (repayAmount.length === 0) {
    return undefined;
  } else if (microfy(repayAmount).gt(ustBalance)) {
    return `Not enough assets`;
  }
  return undefined;
}
