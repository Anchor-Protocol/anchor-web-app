import type { bAsset, u } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';

export function validateDepositAmount(
  depositAmount: bAsset,
  balance: u<bAsset>,
): string | undefined {
  if (depositAmount.length === 0) {
    return undefined;
  } else if (microfy(depositAmount).gt(balance ?? 0)) {
    return `Not enough assets`;
  }
  return undefined;
}
