import { Percent, Rate } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';
import numeral from 'numeral';

export interface FormatOptions {
  delimiter?: boolean;
  fallbackValue?: string;
}

export const MAX_EXECUTE_MSG_DECIMALS = 18;

export function formatFluidDecimalPoints(
  n: BigSource,
  numDecimalPoints: number,
  { delimiter = true, fallbackValue = '' }: FormatOptions = {},
): string {
  const num = big(
    big(n)
      .mul(10 ** numDecimalPoints)
      .toFixed()
      .split('.')[0],
  )
    .div(10 ** numDecimalPoints)
    .toFixed();

  if (num === 'NaN') return fallbackValue;

  const [i, d] = num.split('.');

  const ii = delimiter ? numeral(i).format('0,0') : i;
  const dd = d ? '.' + d : '';

  return ii + dd;
}

export function formatExecuteMsgNumber(n: BigSource): string {
  return formatFluidDecimalPoints(n, MAX_EXECUTE_MSG_DECIMALS, {
    delimiter: false,
    fallbackValue: '0',
  });
}

export function formatPercentage(
  n: Percent<BigSource>,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 2, options);
}

export function formatRateToPercentage(
  n: Rate<BigSource>,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(big(n).mul(100), 2, options);
}
