import type { Rate } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeCurrentLtv(
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
): Rate<Big> | undefined {
  try {
    const collateralTotalUST = overseerCollaterals.collaterals.reduce(
      (total, [token, lockedAmount]) => {
        const oracle = oraclePrices.prices.find(({ asset }) => asset === token);
        return oracle ? total.plus(big(lockedAmount).mul(oracle.price)) : total;
      },
      big(0),
    );

    return big(marketBorrowerInfo.loan_amount).div(
      collateralTotalUST,
    ) as Rate<Big>;
  } catch {
    return undefined;
  }
}
