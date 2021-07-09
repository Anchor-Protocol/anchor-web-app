import { microfy } from '@anchor-protocol/notation';
import type { bAsset, CW20Addr, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import { sum, vectorMinus, vectorMultiply } from '@terra-dev/big-math';
import big, { Big } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';
import { vectorizeBAssetMaxLtvs } from './vectorizeBAssetLtvs';
import { vectorizeOraclePrices } from './vectorizeOraclePrices';
import { vectorizeOverseerCollaterals } from './vectorizeOverseerCollaterals';
import { vectorizeVariations } from './vectorizeVariations';

// New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice) * Max_LTV

export function computeRedeemCollateralBorrowLimit(
  collateralToken: CW20Addr,
  redeemAmount: bAsset,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  bAssetLtvs: BAssetLtvs,
): uUST<Big> | undefined {
  if (redeemAmount.length === 0 || big(redeemAmount).lte(0)) {
    return undefined;
  }

  const vector = oraclePrices.prices.map(({ asset }) => asset);

  const lockedAmounts = vectorizeOverseerCollaterals(
    vector,
    overseerCollaterals.collaterals,
  );
  const variations = vectorizeVariations(vector, [
    [collateralToken, microfy(redeemAmount)],
  ]);
  const prices = vectorizeOraclePrices(vector, oraclePrices.prices);
  const maxLtvs = vectorizeBAssetMaxLtvs(vector, Array.from(bAssetLtvs));

  const newLockedAmounts = vectorMinus(lockedAmounts, variations);
  const ustAmounts = vectorMultiply(newLockedAmounts, prices);
  const borrowLimits = vectorMultiply(ustAmounts, maxLtvs);

  const borrowLimit = sum(...borrowLimits);

  return borrowLimit.lte(0) ? undefined : (borrowLimit as uUST<Big>);

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
