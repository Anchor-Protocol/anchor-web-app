import big, { Big, BigSource } from 'big.js';

// ---------------------------------------------
// currency types
// ---------------------------------------------
export type Currency<T extends string> = { __nominal: T };

export type uaUST<T = string> = T & Currency<'uaust'>;
export type aUST<T = string> = T & Currency<'aust'>;

export type uUST<T = string> = T & Currency<'uust'>;
export type UST<T = string> = T & Currency<'ust'>;

export type uANC<T = string> = T & Currency<'uanc'>;
export type ANC<T = string> = T & Currency<'anc'>;

export type uLuna<T = string> = T & Currency<'uluna'>;
export type Luna<T = string> = T & Currency<'luna'>;

export type ubLuna<T = string> = T & Currency<'ubluna'>;
export type bLuna<T = string> = T & Currency<'bluna'>;

export type uToken<T = string> = T &
  Currency<'uaust' | 'uust' | 'uluna' | 'ubluna' | 'uanc'>;
export type Token<T = string> = T &
  Currency<'aust' | 'ust' | 'luna' | 'bluna' | 'anc'>;

// ---------------------------------------------
// micro
// ---------------------------------------------
export const MICRO = 1000000;

export function microfy<
  C extends
    | Luna<BigSource>
    | bLuna<BigSource>
    | UST<BigSource>
    | aUST<BigSource>
    | ANC<BigSource>
    | Token<BigSource>
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
  : C extends ANC
  ? uANC<Big>
  : C extends Token
  ? uToken<Big>
  : never {
  return big(amount).mul(MICRO) as any;
}

export function demicrofy<
  C extends
    | uLuna<BigSource>
    | ubLuna<BigSource>
    | uUST<BigSource>
    | uaUST<BigSource>
    | uANC<BigSource>
    | uToken<BigSource>
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
  : C extends uANC
  ? ANC<Big>
  : C extends uToken
  ? Token<Big>
  : never {
  return big(amount).div(MICRO) as any;
}
