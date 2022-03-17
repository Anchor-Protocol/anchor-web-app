import { NoMicro } from '@libs/types';
import { formatDecimal } from './formatDecimal';
import { FormatterOutputOptions } from './types';
import big from 'big.js';

const ONE_MILLION = 1000000;

export const formatOutput = <T>(
  amount: T & NoMicro,
  options?: FormatterOutputOptions,
) => {
  const { decimals, postFixUnits = true, delimiter = true } = options ?? {};
  const value = big(amount.toString());

  if (big(value).gt(0) && big(value).lt(0.001)) {
    return '<0.001';
  }

  return value.gte(ONE_MILLION) && postFixUnits
    ? formatDecimal(value.div(ONE_MILLION), decimals ?? 2, delimiter) + 'M'
    : formatDecimal(value, decimals ?? 3, delimiter);
};
