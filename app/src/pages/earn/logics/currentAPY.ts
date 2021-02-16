import { Ratio } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function currentAPY(
  depositRate: Ratio<BigSource> | undefined,
  blocksPerYear: number,
): Ratio<Big> {
  return big(depositRate ?? '0').mul(blocksPerYear) as Ratio<Big>;
}
