import type { Rate, uANC } from '@anchor-protocol/types';
import { anchorToken } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function totalStakedGovShareIndex(
  totalGovStaked: uANC<BigSource> | undefined,
  govState: anchorToken.gov.StateResponse | undefined,
): Rate<Big> | undefined {
  return totalGovStaked && govState && !big(govState.total_share).eq(0)
    ? (big(totalGovStaked).div(govState.total_share) as Rate<Big>)
    : undefined;
}
