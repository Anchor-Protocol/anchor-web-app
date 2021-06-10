import {
  Rate,
  uANC,
  uAncUstLP,
  uaUST,
  ubLuna,
  ubLunaLunaLP,
  uLuna,
  uUST,
} from '@anchor-protocol/types';

interface Gas {
  description: string;
  gasFee: uUST<number>;
  fixedGas: uUST<number>;
}

export interface AnchorContants {
  gasFee: uUST<number>;
  gas: {
    earnDeposit: Gas;
    earnWithdraw: Gas;
    borrowBorrow: Gas;
    borrowRepay: Gas;
    borrowProvideCollateral: Gas;
    borrowRedeemCollateral: Gas;
    bondMint: Gas;
    bondBurn: Gas;
    bondSwap: Gas;
    bondWithdraw: Gas;
    bondClaim: Gas;
    ancBuy: Gas;
    ancSell: Gas;
    ancGovernanceStake: Gas;
    ancGovernanceUnstake: Gas;
    ancAncUstLpProvide: Gas;
    ancAncUstLpWithdraw: Gas;
    ancAncUstLpStake: Gas;
    ancAncUstLpUnstake: Gas;
    rewardsAllClaim: Gas;
    govCreatePoll: Gas;
    govVote: Gas;
    rewardsAncUstLpClaim: Gas;
    rewardsUstBorrowClaim: Gas;
  };
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
