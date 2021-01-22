import big, { BigSource } from 'big.js';
import { aUST, bLuna, Luna, UST } from './currency';
import { formatFluidDecimalPoints, FormatOptions } from './unit.format';

// ---------------------------------------------
// render
// ---------------------------------------------
export function mapDecimalPointBaseSeparatedNumbers<T>(
  n: string,
  mapper: (i: string, d: string | undefined) => T,
): T {
  const [i, d] = n.toString().split('.');
  return mapper(i, d);
}

// ---------------------------------------------
// format
// ---------------------------------------------
export const UST_INPUT_MAXIMUM_INTEGER_POINTS = 14;
export const LUNA_INPUT_MAXIMUM_INTEGER_POINTS = 14;
export const UST_INPUT_MAXIMUM_DECIMAL_POINTS = 3;
export const LUNA_INPUT_MAXIMUM_DECIMAL_POINTS = 6;

export function formatUSTInput(
  // TODO disallow BigSource
  n: UST<BigSource> | aUST<BigSource> | BigSource,
): string {
  return formatFluidDecimalPoints(n, 3, { delimiter: false });
}

export function formatLunaInput(
  // TODO disallow BigSource
  n: Luna<BigSource> | bLuna<BigSource> | BigSource,
): string {
  return formatFluidDecimalPoints(n, 6, { delimiter: false });
}

export function formatUST(
  // TODO disallow BigSource
  n: UST<BigSource> | aUST<BigSource> | BigSource,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 3, options);
}

export function formatUSTWithPostfixUnits(
  // TODO disallow BigSource
  n: UST<BigSource> | aUST<BigSource> | BigSource,
  options: FormatOptions = { delimiter: true },
): string {
  const bn = big(n);

  if (bn.gte(1000000)) {
    return formatFluidDecimalPoints(bn.div(1000000), 2, options) + 'M';
  } else {
    return formatUST(n, options);
  }
}

export function formatLuna(
  // TODO disallow BigSource
  n: Luna<BigSource> | bLuna<BigSource> | BigSource,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 6, options);
}
