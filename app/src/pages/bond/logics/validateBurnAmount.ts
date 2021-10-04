import type { bLuna } from '@anchor-protocol/types';
import { AnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { microfy } from '@libs/formatter';
import { ReactNode } from 'react';

export function validateBurnAmount(
  burnAmount: bLuna,
  bank: AnchorBank,
): ReactNode {
  if (burnAmount.length === 0) {
    return undefined;
  } else if (microfy(burnAmount).gt(bank.tokenBalances.ubLuna ?? 0)) {
    return `Not enough bAssets`;
  }
  return undefined;
}
