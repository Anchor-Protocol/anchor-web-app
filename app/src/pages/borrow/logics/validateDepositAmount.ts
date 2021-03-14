import { microfy } from '@anchor-protocol/notation';
import type { bLuna } from '@anchor-protocol/types';
import { Bank } from 'base/contexts/bank';
import { ReactNode } from 'react';

export function validateDepositAmount(
  depositAmount: bLuna,
  bank: Bank,
): ReactNode {
  if (depositAmount.length === 0) {
    return undefined;
  } else if (microfy(depositAmount).gt(bank.userBalances.ubLuna ?? 0)) {
    return `Not enough assets`;
  }
  return undefined;
}
