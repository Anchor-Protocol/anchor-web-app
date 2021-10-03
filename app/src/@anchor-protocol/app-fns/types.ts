import { AddressMap } from '@anchor-protocol/anchor.js';
import {
  ANC,
  AncUstLP,
  aUST,
  bEth,
  bLuna,
  bLunaLunaLP,
  Luna,
  Rate,
  u,
  UST,
} from '@anchor-protocol/types';

//export interface AnchorConstants {
//  gasWanted: Gas;
//  fixedGas: Gas;
//  airdropGasWanted: Gas;
//  airdropGas: Gas;
//  //fixedGas: u<UST<number>>;
//  blocksPerYear: number;
//  gasAdjustment: Rate<number>;
//}

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
  uUST: u<UST>;
  uUSD: u<UST>;
  uLuna: u<Luna>;
  // cw20 tokens
  uaUST: u<aUST>;
  ubLuna: u<bLuna>;
  ubEth: u<bEth>;
  uANC: u<ANC>;
  uAncUstLP: u<AncUstLP>;
  ubLunaLunaLP: u<bLunaLunaLP>;
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
  maxTaxUUSD: u<UST>;
}

export interface ExpandAddressMap extends AddressMap {
  terraswapFactory: string;
}
