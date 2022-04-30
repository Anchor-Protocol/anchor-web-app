import type { Rate } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeApr(
  depositRate: Rate | undefined,
  blocksPerYear: number,
): Rate<Big> {
  return big(depositRate ?? '0').mul(blocksPerYear) as Rate<Big>;
}
