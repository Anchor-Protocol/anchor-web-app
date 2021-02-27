import {
  ANC,
  aToken,
  aUST,
  bLuna,
  Luna,
  Token,
  uANC,
  uaToken,
  uaUST,
  ubLuna,
  uLuna,
  UST,
  uToken,
  uUST,
} from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

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
    | aToken<BigSource>
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
  : C extends uaToken
  ? aToken<Big>
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
    | uaToken<BigSource>
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
  : C extends uaToken
  ? aToken<Big>
  : C extends uToken
  ? Token<Big>
  : never {
  return big(amount).div(MICRO) as any;
}
