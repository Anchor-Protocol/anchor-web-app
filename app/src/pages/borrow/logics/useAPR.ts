import { Ratio } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { BLOCKS_PER_YEAR } from 'env';
import { useMemo } from 'react';

export function useAPR(borrowRate: Ratio<BigSource> | undefined): Ratio<Big> {
  return useMemo(
    () => big(borrowRate ?? 0).mul(BLOCKS_PER_YEAR) as Ratio<Big>,
    [borrowRate],
  );
}
