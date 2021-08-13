import { microfy } from '@anchor-protocol/notation';
import type { bAsset, ubAsset } from '@anchor-protocol/types';
import { BigSource } from 'big.js';
import { ReactNode } from 'react';

export function validateRedeemAmount(
  redeemAmount: bAsset,
  withdrawableMaxAmount: ubAsset<BigSource> | undefined,
): ReactNode {
  if (redeemAmount.length === 0 || !withdrawableMaxAmount) {
    return undefined;
  } else if (microfy(redeemAmount).gt(withdrawableMaxAmount ?? 0)) {
    return `Cannot withdraw more than collateralized amount`;
  }
  return undefined;
}
