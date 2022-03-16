import { BigSource } from 'big.js';
import { formatDecimal } from './formatDecimal';

export const formatInput = <T>(amount: BigSource, decimals: number): T => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount.replace(/,/g, ''));
  }
  return formatDecimal(amount, decimals, false) as any;
};
