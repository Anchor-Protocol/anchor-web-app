import type { Rate } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { computeApr } from './computeApr';

export function computeApy(
  depositRate: Rate | undefined,
  blocksPerYear: number,
): Rate<Big> {
  const apy = big(
    Math.pow(
      big(depositRate ?? '0')
        .add(1)
        .toNumber(),
      blocksPerYear,
    ) - 1,
  ) as Rate<Big>;

  if (apy.toNumber() >= 0.19) {
    return computeApr(depositRate, blocksPerYear);
  }

  return apy;
}
