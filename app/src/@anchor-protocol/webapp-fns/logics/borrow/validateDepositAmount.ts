import { microfy } from '@anchor-protocol/notation';
import type { bAsset, ubAsset } from '@anchor-protocol/types';
import { ReactNode } from 'react';

export function validateDepositAmount(
  depositAmount: bAsset,
  balance: ubAsset,
): ReactNode {
  if (depositAmount.length === 0) {
    return undefined;
  } else if (microfy(depositAmount).gt(balance ?? 0)) {
    return `Not enough assets`;
  }
  return undefined;
}
