import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'base/contexts/bank';
import { ReactNode } from 'react';

export function validateWithdrawAmount(
  withdrawAmount: UST,
  bank: Bank,
  totalDeposit: uUST<BigSource>,
  txFee: uUST<Big> | undefined,
): ReactNode {
  const amount = microfy(withdrawAmount);

  if (withdrawAmount.length === 0) {
    return undefined;
  } else if (amount.gt(totalDeposit)) {
    return `Not enough aUST`;
  } else if (txFee && big(bank.userBalances.uUSD).lt(txFee)) {
    return `Not enough UST`;
  }
  return undefined;
}
