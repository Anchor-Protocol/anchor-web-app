import type { u, UST } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';
import { ReactNode } from 'react';

export function validateTxFee(
  ustBalance: u<UST<BigSource>> | undefined,
  txFee: u<UST<BigSource>>,
): ReactNode {
  if (big(ustBalance ?? 0).lt(txFee)) {
    return 'Not enough transaction fees';
  }
  return undefined;
}
