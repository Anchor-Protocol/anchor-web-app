import { useBorrowAPYQuery } from '@anchor-protocol/app-provider';
import { Rate } from '@anchor-protocol/types';
import { BigSource } from 'big.js';

export function useAncStakingApr(
  defaultRate?: Rate<BigSource>,
): Rate<BigSource> | undefined {
  const { data: { govRewards } = {} } = useBorrowAPYQuery();

  return govRewards && govRewards.length > 0
    ? govRewards[0].CurrentAPY
    : defaultRate;
}
