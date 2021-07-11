import { moneyMarket, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';

export function computeBorrowLimit(
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  bAssetLtvs: BAssetLtvs,
): uUST<BigSource> {
  return overseerCollaterals.collaterals.reduce(
    (total, [token, lockedAmount]) => {
      const oracle = oraclePrices.prices.find(({ asset }) => asset === token);
      const ltv = bAssetLtvs.get(token);

      if (!oracle || !ltv) {
        return total;
      }

      return big(lockedAmount).mul(oracle.price).mul(ltv.max);
    },
    big(0),
  ) as uUST<Big>;
}
