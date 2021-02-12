import { Ratio } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useCurrentAPY(
  depositRate: Ratio<BigSource> | undefined,
  blocksPerYear: number,
): Ratio<Big> {
  return useMemo(
    () => big(depositRate ?? '0').mul(blocksPerYear) as Ratio<Big>,
    [blocksPerYear, depositRate],
  );
}
