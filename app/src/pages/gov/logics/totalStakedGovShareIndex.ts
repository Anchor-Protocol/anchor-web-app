import { Ratio, uANC } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function totalStakedGovShareIndex(
  totalGovStaked: uANC<BigSource> | undefined,
  totalshare: uANC<BigSource> | undefined,
): Ratio<Big> | undefined {
  return totalGovStaked && totalshare && !big(totalshare).eq(0)
    ? (big(totalGovStaked).div(totalshare) as Ratio<Big>)
    : undefined;
}
