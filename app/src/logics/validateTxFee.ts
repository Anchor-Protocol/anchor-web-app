import type { uUST } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';
import { Bank } from 'base/contexts/bank';
import { ReactNode } from 'react';

export function validateTxFee(
  bank: Bank,
  fixedGas: uUST<BigSource>,
): ReactNode {
  if (big(bank.userBalances.uUSD ?? 0).lt(fixedGas)) {
    return 'Not enough transaction fees';
  }
  return undefined;
}
