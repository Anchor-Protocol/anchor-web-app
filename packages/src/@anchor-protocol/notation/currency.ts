import {
  ANC,
  AncUstLP,
  aToken,
  aUST,
  bLuna,
  bLunaLunaLP,
  CW20Token,
  LPToken,
  Luna,
  NativeToken,
  Token,
  uANC,
  uAncUstLP,
  uaToken,
  uaUST,
  ubLuna,
  ubLunaLunaLP,
  uCW20Token,
  uLPToken,
  uLuna,
  uNativeToken,
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
  C extends  // native tokens
    | UST<BigSource>
    | Luna<BigSource>
    // cw20 tokens
    | aUST<BigSource>
    | ANC<BigSource>
    | bLuna<BigSource>
    | AncUstLP<BigSource>
    | bLunaLunaLP<BigSource>
    // union tokens
    | aToken<BigSource>
    | NativeToken<BigSource>
    | CW20Token<BigSource>
    | LPToken<BigSource>
    | Token<BigSource>
>(
  amount: C,
): C extends UST
  ? uUST<Big>
  : C extends Luna
  ? uLuna<Big>
  : C extends aUST
  ? uaUST<Big>
  : C extends ANC
  ? uANC<Big>
  : C extends bLuna
  ? ubLuna<Big>
  : C extends AncUstLP
  ? uAncUstLP<Big>
  : C extends bLunaLunaLP
  ? ubLunaLunaLP<Big>
  : C extends aToken
  ? uaToken<Big>
  : C extends NativeToken
  ? uNativeToken<Big>
  : C extends CW20Token
  ? uCW20Token<Big>
  : C extends LPToken
  ? uLPToken<Big>
  : C extends Token
  ? uToken<Big>
  : never {
  return big(amount).mul(MICRO) as any;
}

export function demicrofy<
  C extends  // native tokens
    | uUST<BigSource>
    | uLuna<BigSource>
    // cw20 tokens
    | uaUST<BigSource>
    | uANC<BigSource>
    | ubLuna<BigSource>
    | uAncUstLP<BigSource>
    | ubLunaLunaLP<BigSource>
    // union tokens
    | uaToken<BigSource>
    | uToken<BigSource>
>(
  amount: C,
): C extends uUST
  ? UST<Big>
  : C extends uLuna
  ? Luna<Big>
  : C extends uaUST
  ? aUST<Big>
  : C extends uANC
  ? ANC<Big>
  : C extends ubLuna
  ? bLuna<Big>
  : C extends uAncUstLP
  ? AncUstLP<Big>
  : C extends ubLunaLunaLP
  ? bLunaLunaLP<Big>
  : C extends uaToken
  ? aToken<Big>
  : C extends uNativeToken
  ? NativeToken<Big>
  : C extends uCW20Token
  ? CW20Token<Big>
  : C extends uLPToken
  ? LPToken<Big>
  : C extends uToken
  ? Token<Big>
  : never {
  return big(amount).div(MICRO) as any;
}
