import type { Rate } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeApy(
  depositRate: Rate | undefined,
  blocksPerYear: number,
): Rate<Big> {
  return big(
    Math.pow(
      big(depositRate ?? '0')
        .add(1)
        .toNumber(),
      blocksPerYear,
    ) - 1,
  ) as Rate<Big>;
}
