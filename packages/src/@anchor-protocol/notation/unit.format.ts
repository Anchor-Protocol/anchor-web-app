import big, { BigSource } from 'big.js';
import numeral from 'numeral';
import { Percent, Ratio } from './unit';

export interface FormatOptions {
  delimiter?: boolean;
  fallbackValue?: string;
}

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

  const str = numeral(num).format(
    delimiter
      ? `0,0.[${'0'.repeat(numDecimalPoints)}]`
      : `0.[${'0'.repeat(numDecimalPoints)}]`,
  );

  return str === 'NaN' ? fallbackValue : str;
}

export function formatPercentage(
  n: Percent<BigSource>,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 2, options);
}

export function formatRatioToPercentage(
  n: Ratio<BigSource>,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(big(n).mul(100), 2, options);
}
