import { Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import big, { BigSource } from 'big.js';

export function formatShareOfPool(shareOfPool: Rate<BigSource>) {
  const v = big(shareOfPool);
  return v.lt(0.01) ? '<0.01' : v.gt(99.9) ? '>99.9' : formatRate(shareOfPool);
}
