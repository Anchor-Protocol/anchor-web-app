import { Ratio } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useAPR(
  borrowRate: Ratio<BigSource> | undefined,
  blocksPerYear: number,
): Ratio<Big> {
  return useMemo(() => big(borrowRate ?? 0).mul(blocksPerYear) as Ratio<Big>, [
    blocksPerYear,
    borrowRate,
  ]);
}
