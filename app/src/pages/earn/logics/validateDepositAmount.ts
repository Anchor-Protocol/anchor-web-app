import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import { Big } from 'big.js';
import { Bank } from 'base/contexts/bank';
import { ReactNode } from 'react';

export function validateDepositAmount(
  depositAmount: UST,
  bank: Bank,
  txFee: uUST<Big> | undefined,
): ReactNode {
  if (depositAmount.length === 0) {
    return undefined;
  } else if (
    microfy(depositAmount)
      .plus(txFee ?? 0)
      .gt(bank.userBalances.uUSD)
  ) {
    return `Not enough UST`;
  }
  return undefined;
}
