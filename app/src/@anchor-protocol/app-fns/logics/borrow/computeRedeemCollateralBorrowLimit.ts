import { computeBorrowLimit } from '@anchor-protocol/app-fns';
import type { bAsset, CW20Addr, u, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';

// New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice) * Max_LTV

// export function computeRedeemCollateralBorrowLimit(
//   collateralToken: CW20Addr,
//   redeemAmount: bAsset,
//   overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
//   oraclePrices: moneyMarket.oracle.PricesResponse,
//   bAssetLtvs: BAssetLtvs,
// ): u<UST<Big>> {
//   if (redeemAmount.length === 0 || big(redeemAmount).lte(0)) {
//     return big(0) as u<UST<Big>>;
//   }

//   const vector = oraclePrices.prices.map(({ asset }) => asset);

//   const lockedAmounts = vectorizeOverseerCollaterals(
//     vector,
//     overseerCollaterals.collaterals,
//   );
//   const variations = vectorizeVariations(vector, [
//     [collateralToken, microfy(redeemAmount)],
//   ]);
//   const prices = vectorizeOraclePrices(vector, oraclePrices.prices);
//   const maxLtvs = vectorizeBAssetMaxLtvs(vector, Array.from(bAssetLtvs));

//   const newLockedAmounts = vectorMinus(lockedAmounts, variations);
//   const ustAmounts = vectorMultiply(newLockedAmounts, prices);
//   const borrowLimits = vectorMultiply(ustAmounts, maxLtvs);

//   const borrowLimit = sum(...borrowLimits) ?? big(0);

//   return borrowLimit as u<UST<Big>>;
//   //return borrowLimit.lte(0) ? undefined : (borrowLimit as u<UST<Big>>);
// }

export function computeRedeemCollateralBorrowLimit(
  collateralToken: CW20Addr,
  redeemAmount: bAsset,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  bAssetLtvs: BAssetLtvs,
): u<UST<Big>> {
  if (redeemAmount.length <= 0) {
    return big(0) as u<UST<Big>>;
  }
  return computeBorrowLimit(overseerCollaterals, oraclePrices, bAssetLtvs, [
    collateralToken,
    big(redeemAmount).mul(-1) as u<bAsset<BigSource>>,
  ]);
}
