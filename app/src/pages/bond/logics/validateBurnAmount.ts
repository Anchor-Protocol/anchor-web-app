import type { bLuna } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { Bank } from 'contexts/bank';
import { ReactNode } from 'react';

export function validateBurnAmount(burnAmount: bLuna, bank: Bank): ReactNode {
  if (burnAmount.length === 0) {
    return undefined;
  } else if (microfy(burnAmount).gt(bank.userBalances.ubLuna ?? 0)) {
    return `Not enough bAssets`;
  }
  return undefined;
}
