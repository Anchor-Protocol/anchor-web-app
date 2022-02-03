import { moneyMarket, u, UST } from '@anchor-protocol/types';
import { sum, vectorMultiply } from '@libs/big-math';
import { Big } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';
import { vectorizeBAssetMaxLtvs } from './vectorizeBAssetLtvs';
import { vectorizeOraclePrices } from './vectorizeOraclePrices';
import { vectorizeOverseerCollaterals } from './vectorizeOverseerCollaterals';

export function computeBorrowLimit(
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  bAssetLtvs: BAssetLtvs,
): u<UST<Big>> {
  const vector = oraclePrices.prices.map(({ asset }) => asset);
  const lockedAmounts = vectorizeOverseerCollaterals(
    vector,
    overseerCollaterals.collaterals,
  );
  const prices = vectorizeOraclePrices(vector, oraclePrices.prices);
  const maxLtvs = vectorizeBAssetMaxLtvs(vector, Array.from(bAssetLtvs));

  // sum([lockedAmounts] * [prices] * [maxLtvs])

  const ustAmounts = vectorMultiply(lockedAmounts, prices);
  const ustBorrowLimits = vectorMultiply(ustAmounts, maxLtvs);

  return sum(...ustBorrowLimits) as u<UST<Big>>;
}
