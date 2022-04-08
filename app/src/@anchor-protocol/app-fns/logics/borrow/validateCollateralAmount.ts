import type { CollateralAmount, u } from '@anchor-protocol/types';
import Big from 'big.js';

export function validateCollateralAmount(
  collateralAmount?: u<CollateralAmount<Big>>,
  maxCollateralAmount?: u<CollateralAmount<Big>>,
): string | undefined {
  if (collateralAmount?.gt(maxCollateralAmount ?? 0)) {
    return 'Cannot supply more than available.';
  }
  return undefined;
}
