import type { bAsset, u } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { BigSource } from 'big.js';

export function validateRedeemAmount(
  redeemAmount: bAsset,
  withdrawableMaxAmount: u<bAsset<BigSource>> | undefined,
  decimals: number,
): string | undefined {
  if (redeemAmount.length === 0 || !withdrawableMaxAmount) {
    return undefined;
  } else if (microfy(redeemAmount, decimals).gt(withdrawableMaxAmount ?? 0)) {
    return `Cannot withdraw more than collateralized amount`;
  }
  return undefined;
}
