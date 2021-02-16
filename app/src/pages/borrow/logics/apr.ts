import { Ratio } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function apr(
  borrowRate: Ratio<BigSource> | undefined,
  blocksPerYear: number,
): Ratio<Big> {
  return big(borrowRate ?? 0).mul(blocksPerYear) as Ratio<Big>;
}
