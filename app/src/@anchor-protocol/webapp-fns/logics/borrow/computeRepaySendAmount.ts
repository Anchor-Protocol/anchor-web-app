import type { u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { Big, BigSource } from 'big.js';

export function computeRepaySendAmount(
  repayAmount: UST,
  txFee: u<UST<BigSource>> | undefined,
): u<UST<Big>> | undefined {
  return repayAmount.length > 0 && txFee
    ? (microfy(repayAmount).plus(txFee) as u<UST<Big>>)
    : undefined;
}
