import { Percent, Rate } from '@libs/types';
import big, { BigSource } from 'big.js';
import numeral from 'numeral';

export interface FormatOptions {
  delimiter?: boolean;
  fallbackValue?: string;
}

export const MAX_EXECUTE_MSG_DECIMALS = 18;

export const formatDemimal =
  ({
    decimalPoints,
    delimiter,
  }: {
    decimalPoints: number;
    delimiter: boolean;
  }) =>
  (n: BigSource, fallbackValue: string = ''): string => {
    const num = big(
      big(n)
        .mul(10 ** decimalPoints)
        .toFixed()
        .split('.')[0],
    )
      .div(10 ** decimalPoints)
      .toFixed();

    if (num === 'NaN') return fallbackValue;

    const [i, d] = num.split('.');

    const ii = delimiter ? numeral(i).format('0,0') : i;
    const dd = d ? '.' + d : '';

    return (ii === '0' && num[0] === '-' ? '-' : '') + ii + dd;
  };

export const formatInteger =
  ({ delimiter }: { delimiter: boolean }) =>
  (n: BigSource): string => {
    const num = big(n).toFixed();

    const [i] = num.split('.');

    return delimiter ? numeral(i).format('0,0') : i;
  };

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

  return (ii === '0' && num[0] === '-' ? '-' : '') + ii + dd;
}

// ---------------------------------------------
// formatters
// ---------------------------------------------
export const executeMsgFormatter = formatDemimal({
  decimalPoints: MAX_EXECUTE_MSG_DECIMALS,
  delimiter: false,
});

const percentageFormatter = formatDemimal({
  decimalPoints: 2,
  delimiter: true,
});

// ---------------------------------------------
// functions
// ---------------------------------------------
export const formatExecuteMsgNumber = executeMsgFormatter;

export const formatPercentage = (n: Percent<BigSource>) =>
  percentageFormatter(n);

export const formatRate = (n: Rate<BigSource>) =>
  percentageFormatter(big(n).mul(100));
