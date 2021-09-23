import {
  AUD,
  CAD,
  CHF,
  CNY,
  DKK,
  EUR,
  Gas,
  GBP,
  HKD,
  IDR,
  INR,
  JPY,
  KRW,
  Luna,
  MNT,
  NOK,
  PHP,
  Rate,
  SDR,
  SEK,
  SGD,
  THB,
  u,
  UST,
} from '@libs/types';

/**
 * You can cast the token values as nominal types
 *
 * @example
 * ```
 * // const { tokenBalances: { uUST } } = useBank() // Record<string, string>
 * const { tokenBalances: { uUST } } = useBank<NebulaTokens>() // { uUST: uUST }
 * ```
 */
export interface TokenBalances {
  // native tokens
  uAUD: u<AUD>;
  uCAD: u<CAD>;
  uCHF: u<CHF>;
  uCNY: u<CNY>;
  uDKK: u<DKK>;
  uEUR: u<EUR>;
  uGBP: u<GBP>;
  uHKD: u<HKD>;
  uIDR: u<IDR>;
  uINR: u<INR>;
  uJPY: u<JPY>;
  uKRW: u<KRW>;
  uLuna: u<Luna>;
  uMNT: u<MNT>;
  uNOK: u<NOK>;
  uPHP: u<PHP>;
  uSDR: u<SDR>;
  uSEK: u<SEK>;
  uSGD: u<SGD>;
  uTHB: u<THB>;
  uUST: u<UST>;
}

/**
 * You can cast the tax values as nominal types
 *
 * @example
 * ```
 * // const { tax: { taxRate, maxTaxUUSD } } = useBank() // { taxRate: string, maxTaxUUSD: string }
 * const { tax: { taxRate, maxTaxUUSD } } = useBank<any, NebulaTax>() // { taxRate: Rate, maxTaxUUSD: uUST }
 * ```
 */
export interface Tax {
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
}

export interface TerraContantsInput {
  gasFee: Gas;
  fixedGasGas: Gas;
  blocksPerYear: number;
  gasAdjustment: Rate<number>;
}

export interface TerraContants extends TerraContantsInput {
  fixedGas: u<UST<number>>;
}
