import type { bAsset, u } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { BigSource } from 'big.js';
import { ReactNode } from 'react';

export function validateRedeemAmount(
  redeemAmount: bAsset,
  withdrawableMaxAmount: u<bAsset<BigSource>> | undefined,
): ReactNode {
  if (redeemAmount.length === 0 || !withdrawableMaxAmount) {
    return undefined;
  } else if (microfy(redeemAmount).gt(withdrawableMaxAmount ?? 0)) {
    return `Cannot withdraw more than collateralized amount`;
  }
  return undefined;
}
