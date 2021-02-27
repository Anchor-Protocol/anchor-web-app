import type { Rate } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function apr(
  borrowRate: Rate<BigSource> | undefined,
  blocksPerYear: number,
): Rate<Big> {
  return big(borrowRate ?? 0).mul(blocksPerYear) as Rate<Big>;
}
