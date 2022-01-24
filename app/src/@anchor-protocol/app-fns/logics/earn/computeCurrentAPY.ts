import type { Rate } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeCurrentAPY(
  overseerEpochState: moneyMarket.overseer.EpochStateResponse | undefined,
  blocksPerYear: number,
): Rate<Big> {
  const blockApr = parseFloat(overseerEpochState?.deposit_rate ?? '0') + 1;
  // can't use .pow() since blocksPerYear is bigger than 1e6
  return big(Math.pow(blockApr, blocksPerYear)).sub(1) as Rate<Big>;
}
