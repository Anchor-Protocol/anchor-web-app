import big, { Big, BigSource } from 'big.js';

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
