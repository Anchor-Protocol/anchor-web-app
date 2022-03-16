import { NoMicro, u } from '@libs/types';
import big from 'big.js';

export const microfy = <T>(amount: T & NoMicro, decimals: number): u<T> => {
  return big(amount.toString())
    .mul(Math.pow(10, decimals))
    .toFixed()
    .toString() as any;
};
