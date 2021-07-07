import type { Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralTotalUST } from './computeCollateralTotalUST';

export function computeBorrowMax(
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  maxLtv: Rate<BigSource>,
): uUST<Big> {
  const collateralTotalUST = computeCollateralTotalUST(
    overseerCollaterals,
    oraclePrices,
  );

  return big(maxLtv)
    .mul(collateralTotalUST)
    .minus(marketBorrowerInfo.loan_amount) as uUST<Big>;
}
