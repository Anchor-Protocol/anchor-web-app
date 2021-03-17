import type { Luna } from '@anchor-protocol/types';
import { microfy } from '@anchor-protocol/notation';
import { Bank } from 'base/contexts/bank';
import { ReactNode } from 'react';

export function validateBondAmount(bondAmount: Luna, bank: Bank): ReactNode {
  if (bondAmount.length === 0) {
    return undefined;
  } else if (microfy(bondAmount).gt(bank.userBalances.uLuna ?? 0)) {
    return `Not enough assets`;
  }
  return undefined;
}
