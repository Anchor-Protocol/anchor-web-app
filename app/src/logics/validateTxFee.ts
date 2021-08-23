import type { u, UST } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { ReactNode } from 'react';

/** @deprecated */
export function validateTxFee(bank: Bank, txFee: u<UST<BigSource>>): ReactNode {
  if (big(bank.userBalances.uUSD ?? 0).lt(txFee)) {
    return 'Not enough transaction fees';
  }
  return undefined;
}
