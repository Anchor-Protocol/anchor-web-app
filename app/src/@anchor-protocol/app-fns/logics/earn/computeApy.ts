import type { Rate } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { computeApr } from './computeApr';

export function computeApy(
  depositRate: Rate | undefined,
  blocksPerYear: number,
  epochPeriod: number,
): Rate<Big> {
  const compoundTimes = blocksPerYear / epochPeriod;
  const perCompound = big(depositRate ?? '0').mul(epochPeriod);

  const apy = big(
    Math.pow(perCompound.add(1).toNumber(), compoundTimes) - 1,
  ) as Rate<Big>;

  if (apy.toNumber() >= 0.2) {
    return computeApr(depositRate, blocksPerYear);
  }

  return apy;
}
