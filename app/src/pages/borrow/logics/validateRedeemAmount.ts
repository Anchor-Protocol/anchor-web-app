import { bLuna, microfy, ubLuna } from '@anchor-protocol/notation';
import { BigSource } from 'big.js';
import { ReactNode } from 'react';

export function validateRedeemAmount(
  redeemAmount: bLuna,
  withdrawableMaxAmount: ubLuna<BigSource>,
): ReactNode {
  if (redeemAmount.length === 0) {
    return undefined;
  } else if (microfy(redeemAmount).gt(withdrawableMaxAmount ?? 0)) {
    return `Cannot withdraw more than collateralized amount`;
  }
  return undefined;
}
