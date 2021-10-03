import type { u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { BigSource } from 'big.js';
import { ReactNode } from 'react';

export function validateRepayAmount(
  repayAmount: UST,
  ustBalance: u<UST<BigSource>>,
): ReactNode {
  if (repayAmount.length === 0) {
    return undefined;
  } else if (microfy(repayAmount).gt(ustBalance)) {
    return `Not enough assets`;
  }
  return undefined;
}
