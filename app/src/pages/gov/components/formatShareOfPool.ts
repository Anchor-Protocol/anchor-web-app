import { formatRateToPercentage } from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';

export function formatShareOfPool(shareOfPool: Rate<BigSource>) {
  const v = big(shareOfPool);
  return v.lt(0.01)
    ? '<0.01'
    : v.gt(99.9)
    ? '>99.9'
    : formatRateToPercentage(shareOfPool);
}
