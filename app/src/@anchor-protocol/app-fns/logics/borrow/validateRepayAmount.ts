import type { u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { BigSource } from 'big.js';

export function validateRepayAmount(
  repayAmount: UST,
  ustBalance: u<UST<BigSource>>,
): string | undefined {
  if (repayAmount.length === 0) {
    return undefined;
  } else if (microfy(repayAmount).gt(ustBalance)) {
    return `Not enough assets`;
  }
  return undefined;
}
