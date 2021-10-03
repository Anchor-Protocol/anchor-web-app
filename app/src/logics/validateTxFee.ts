import type { u, UST } from '@anchor-protocol/types';
import { AnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import big, { BigSource } from 'big.js';
import { ReactNode } from 'react';

/** @deprecated */
export function validateTxFee(
  bank: AnchorBank,
  txFee: u<UST<BigSource>>,
): ReactNode {
  if (big(bank.userBalances.uUSD ?? 0).lt(txFee)) {
    return 'Not enough transaction fees';
  }
  return undefined;
}
