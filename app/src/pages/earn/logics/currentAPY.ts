import type { Rate } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function currentAPY(
  depositRate: Rate<BigSource> | undefined,
  blocksPerYear: number,
): Rate<Big> {
  return big(depositRate ?? '0').mul(blocksPerYear) as Rate<Big>;
}
