import type { bAsset, Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

// New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice) * Max_LTV

// TODO
export function computeRedeemCollateralBorrowLimit(
  redeemAmount: bAsset,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  maxLtv: Rate<BigSource>,
): uUST<Big> | undefined {
  if (redeemAmount.length === 0) {
    return undefined;
  }

  return undefined;

  //const borrowLimit = big(
  //  big(
  //    big(borrower.balance)
  //      .minus(borrower.spendable)
  //      .minus(microfy(redeemAmount)),
  //  ).mul(oracle.rate),
  //).mul(bLunaMaxLtv) as uUST<Big>;
  //
  //return borrowLimit.lt(0) ? undefined : borrowLimit;
}
