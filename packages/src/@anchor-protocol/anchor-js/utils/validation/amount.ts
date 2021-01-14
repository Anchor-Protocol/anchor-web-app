import { Dec } from '@terra-money/terra.js';

export function isAmountSet(amount: string | undefined): amount is string {
  return !!amount && !new Dec(amount).isNaN();
}
