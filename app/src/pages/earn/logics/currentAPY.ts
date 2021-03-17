import type { Rate } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function currentAPY(
  epochState: moneyMarket.overseer.EpochStateResponse | undefined,
  blocksPerYear: number,
): Rate<Big> {
  return big(epochState?.deposit_rate ?? '0').mul(blocksPerYear) as Rate<Big>;
}
