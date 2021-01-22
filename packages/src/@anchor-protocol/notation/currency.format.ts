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

export function formatUSTInput<C extends UST<BigSource> | aUST<BigSource>>(
  n: C,
): C extends UST<BigSource> ? UST : C extends aUST<BigSource> ? aUST : never {
  return formatFluidDecimalPoints(n, 3, { delimiter: false }) as any;
}

export function formatLunaInput<C extends Luna<BigSource> | bLuna<BigSource>>(
  n: C,
): C extends Luna<BigSource>
  ? Luna
  : C extends bLuna<BigSource>
  ? bLuna
  : never {
  return formatFluidDecimalPoints(n, 6, { delimiter: false }) as any;
}

export function formatUST(
  n: UST<BigSource> | aUST<BigSource>,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 3, options);
}

export function formatUSTWithPostfixUnits(
  n: UST<BigSource> | aUST<BigSource>,
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
  n: Luna<BigSource> | bLuna<BigSource>,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 6, options);
}
