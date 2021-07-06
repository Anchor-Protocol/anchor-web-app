import type { uUST } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { ReactNode } from 'react';

export function validateTxFee(bank: Bank, txFee: uUST<BigSource>): ReactNode {
  if (big(bank.userBalances.uUSD ?? 0).lt(txFee)) {
    return 'Not enough transaction fees';
  }
  return undefined;
}
