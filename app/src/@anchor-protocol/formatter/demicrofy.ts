import { Token, u } from '@libs/types';
import big, { BigSource } from 'big.js';

export const demicrofy = <T>(
  amount: u<T> | Token<BigSource>,
  decimals: number,
): T => {
  return big(amount.toString())
    .div(Math.pow(10, decimals))
    .toFixed()
    .toString() as any;
};
