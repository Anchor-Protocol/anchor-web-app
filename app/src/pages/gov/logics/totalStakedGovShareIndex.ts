import type { Rate, uANC } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function totalStakedGovShareIndex(
  totalGovStaked: uANC<BigSource> | undefined,
  totalshare: uANC<BigSource> | undefined,
): Rate<Big> | undefined {
  return totalGovStaked && totalshare && !big(totalshare).eq(0)
    ? (big(totalGovStaked).div(totalshare) as Rate<Big>)
    : undefined;
}
