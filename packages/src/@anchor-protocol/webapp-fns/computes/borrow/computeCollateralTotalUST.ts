import { moneyMarket, uUST } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeCollateralTotalUST(
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
): uUST<Big> {
  return overseerCollaterals.collaterals.reduce(
    (total, [token, lockedAmount]) => {
      const oracle = oraclePrices.prices.find(({ asset }) => asset === token);
      return oracle ? total.plus(big(lockedAmount).mul(oracle.price)) : total;
    },
    big(0),
  ) as uUST<Big>;
}
