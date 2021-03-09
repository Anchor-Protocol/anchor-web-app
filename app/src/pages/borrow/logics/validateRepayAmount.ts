import { microfy } from '@anchor-protocol/notation';
import type { UST } from '@anchor-protocol/types';
import { Bank } from '@anchor-protocol/web-contexts/contexts/bank';
import { ReactNode } from 'react';

export function validateRepayAmount(repayAmount: UST, bank: Bank): ReactNode {
  if (repayAmount.length === 0) {
    return undefined;
  } else if (microfy(repayAmount).gt(bank.userBalances.uUSD)) {
    return `Not enough assets`;
  }
  return undefined;
}
