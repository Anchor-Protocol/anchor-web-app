import { bAsset, CW20Addr, moneyMarket, u, UST } from '@anchor-protocol/types';
import { sum, vectorMultiply } from '@libs/big-math';
import { Big, BigSource } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';
import { vectorizeBAssetMaxLtvs } from './vectorizeBAssetLtvs';
import { vectorizeOraclePrices } from './vectorizeOraclePrices';
import { vectorizeOverseerCollaterals } from './vectorizeOverseerCollaterals';

export function computeBorrowLimit(
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  bAssetLtvs: BAssetLtvs,
  ...addition: Array<[CW20Addr, u<bAsset<BigSource>>]>
): u<UST<Big>> {
  const vector = oraclePrices.prices.map(({ asset }) => asset);
  const lockedAmounts = vectorizeOverseerCollaterals(
    vector,
    overseerCollaterals.collaterals,
  );

  const assets = [...vector, ...addition.map((item) => item[0])];

  const prices = vectorizeOraclePrices(assets, oraclePrices.prices);
  const maxLtvs = vectorizeBAssetMaxLtvs(assets, Array.from(bAssetLtvs));

  const additions = addition.map((item) => item[1]);

  const ustAmounts = vectorMultiply([...lockedAmounts, ...additions], prices);
  const ustBorrowLimits = vectorMultiply(ustAmounts, maxLtvs);

  return sum(...ustBorrowLimits) as u<UST<Big>>;
}
