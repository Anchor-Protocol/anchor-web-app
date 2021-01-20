import big, { Big, BigSource } from 'big.js';
import numeral from 'numeral';

// ---------------------------------------------
// currency types
// ---------------------------------------------
export type Currency<
  T extends
    | 'uluna'
    | 'ubluna'
    | 'uaust'
    | 'uust'
    | 'luna'
    | 'bluna'
    | 'ust'
    | 'aust'
> = { __nominal: T };

export type uLuna<T = string> = T & Currency<'uluna'>;
export type ubLuna<T = string> = T & Currency<'ubluna'>;
export type uaUST<T = string> = T & Currency<'uaust'>;
export type uUST<T = string> = T & Currency<'uust'>;
export type Luna<T = string> = T & Currency<'luna'>;
export type bLuna<T = string> = T & Currency<'bluna'>;
export type aUST<T = string> = T & Currency<'aust'>;
export type UST<T = string> = T & Currency<'aust'>;

// ---------------------------------------------
// micro
// ---------------------------------------------
export const MICRO = 1000000;

export function u<
  C extends
    | Luna<BigSource>
    | bLuna<BigSource>
    | UST<BigSource>
    | aUST<BigSource>
>(
  amount: C,
): C extends Luna
  ? uLuna<Big>
  : C extends bLuna
  ? ubLuna<Big>
  : C extends UST
  ? uUST<Big>
  : C extends aUST
  ? uaUST<Big>
  : never {
  return big(amount).mul(MICRO) as any;
}

export function du<
  C extends
    | uLuna<BigSource>
    | ubLuna<BigSource>
    | uUST<BigSource>
    | uaUST<BigSource>
>(
  amount: C,
): C extends uLuna
  ? Luna<Big>
  : C extends ubLuna
  ? bLuna<Big>
  : C extends uUST
  ? UST<Big>
  : C extends uaUST
  ? aUST<Big>
  : never {
  return big(amount).div(MICRO) as any;
}

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
export interface FormatOptions {
  delimiter?: boolean;
}

export function formatFluidDecimalPoints(
  n: BigSource,
  numDecimalPoints: number,
  { delimiter }: FormatOptions = { delimiter: true },
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

  return str === 'NaN' ? '' : str;
}

export const UST_INPUT_MAXIMUM_INTEGER_POINTS = 14;
export const LUNA_INPUT_MAXIMUM_INTEGER_POINTS = 14;
export const UST_INPUT_MAXIMUM_DECIMAL_POINTS = 3;
export const LUNA_INPUT_MAXIMUM_DECIMAL_POINTS = 6;

export function formatUSTInput(
  n: UST<BigSource> | aUST<BigSource> | BigSource,
): string {
  return formatFluidDecimalPoints(n, 3, { delimiter: false });
}

export function formatLunaInput(
  n: Luna<BigSource> | bLuna<BigSource> | BigSource,
): string {
  return formatFluidDecimalPoints(n, 6, { delimiter: false });
}

export function formatUST(
  n: UST<BigSource> | aUST<BigSource> | BigSource,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 3, options);
}

export function formatUSTWithPostfixUnits(
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
  n: Luna<BigSource> | bLuna<BigSource> | BigSource,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 6, options);
}

export function formatPercentage(
  n: Luna<BigSource> | bLuna<BigSource> | BigSource,
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 2, options);
}
