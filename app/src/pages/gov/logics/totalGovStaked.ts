import type { uANC } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function totalGovStaked(
  balance: uANC<BigSource> | undefined,
  total_deposit: uANC<BigSource> | undefined,
): uANC<Big> | undefined {
  return balance && total_deposit
    ? (big(balance).minus(total_deposit) as uANC<Big>)
    : undefined;
}
