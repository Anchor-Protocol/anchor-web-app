import type { bAsset, u } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';

export function validateRedeemAmount(
  redeemAmount: u<bAsset>,
  withdrawableMaxAmount: u<bAsset<BigSource>> | undefined,
): string | undefined {
  if (redeemAmount.length === 0 || !withdrawableMaxAmount) {
    return undefined;
  } else if (big(redeemAmount).gt(withdrawableMaxAmount ?? 0)) {
    return `Cannot withdraw more than collateralized amount`;
  }
  return undefined;
}
