import type { u, UST } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';

export function validateTxFee(
  ustBalance: u<UST<BigSource>> | undefined,
  txFee: u<UST<BigSource>>,
): string | undefined {
  if (big(ustBalance ?? 0).lt(txFee)) {
    return 'Not enough transaction fees';
  }
  return undefined;
}
