import { CW20Addr, moneyMarket, ubAsset, uUST } from '@anchor-protocol/types';
import { sum, vectorPlus, vectorMultiply } from '@packages/big-math';
import { Big, BigSource } from 'big.js';
import { vectorizeOraclePrices } from './vectorizeOraclePrices';
import { vectorizeOverseerCollaterals } from './vectorizeOverseerCollaterals';
import { vectorizeVariations } from './vectorizeVariations';

export function computeCollateralsTotalUST(
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  ...variation: Array<[CW20Addr, ubAsset<BigSource>]>
): uUST<Big> {
  const vector = oraclePrices.prices.map(({ asset }) => asset);
  const lockedAmounts = vectorizeOverseerCollaterals(
    vector,
    overseerCollaterals.collaterals,
  );
  const prices = vectorizeOraclePrices(vector, oraclePrices.prices);
  const variations = vectorizeVariations(vector, variation);

  // sum(([lockedAmounts] + [variations]) * [prices])

  const bAssetAmounts = vectorPlus(lockedAmounts, variations);
  const ustAmounts = vectorMultiply(bAssetAmounts, prices);

  return sum(...ustAmounts) as uUST<Big>;
}
