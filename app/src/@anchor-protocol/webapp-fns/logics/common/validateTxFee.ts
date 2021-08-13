import type { uUST } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';
import { ReactNode } from 'react';

export function validateTxFee(
  ustBalance: uUST<BigSource> | undefined,
  txFee: uUST<BigSource>,
): ReactNode {
  if (big(ustBalance ?? 0).lt(txFee)) {
    return 'Not enough transaction fees';
  }
  return undefined;
}
