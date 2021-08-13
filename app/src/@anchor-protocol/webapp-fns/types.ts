import { AddressMap } from '@anchor-protocol/anchor.js';
import {
  Rate,
  uANC,
  uAncUstLP,
  uaUST,
  ubEth,
  ubLuna,
  ubLunaLunaLP,
  uLuna,
  uUST,
} from '@anchor-protocol/types';

export interface AnchorContants {
  gasFee: uUST<number>;
  fixedGas: uUST<number>;
  blocksPerYear: number;
  gasAdjustment: Rate<number>;
}

/**
 * You can cast the token values as nominal types
 *
 * @example
 * ```
 * // const { tokenBalances: { uUST } } = useBank() // Record<string, string>
 * const { tokenBalances: { uUST } } = useBank<AnchorTokens>() // { uUST: uUST }
 * ```
 */
export interface AnchorTokenBalances {
  // native tokens
  uUST: uUST;
  uLuna: uLuna;
  // cw20 tokens
  uaUST: uaUST;
  ubLuna: ubLuna;
  ubEth: ubEth;
  uANC: uANC;
  uAncUstLP: uAncUstLP;
  ubLunaLunaLP: ubLunaLunaLP;
}

/**
 * You can cast the tax values as nominal types
 *
 * @example
 * ```
 * // const { tax: { taxRate, maxTaxUUSD } } = useBank() // { taxRate: string, maxTaxUUSD: string }
 * const { tax: { taxRate, maxTaxUUSD } } = useBank<any, AnchorTax>() // { taxRate: Rate, maxTaxUUSD: uUST }
 * ```
 */
export interface AnchorTax {
  taxRate: Rate;
  maxTaxUUSD: uUST;
}

export interface ExpandAddressMap extends AddressMap {
  terraswapFactory: string;
}
