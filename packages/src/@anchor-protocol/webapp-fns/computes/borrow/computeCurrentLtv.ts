import type { Rate } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { computeCollateralTotalLockedUST } from './computeCollateralTotalLockedUST';

export function computeCurrentLtv(
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
): Rate<Big> | undefined {
  const totalLockedUST = computeCollateralTotalLockedUST(
    overseerCollaterals,
    oraclePrices,
  );

  return big(marketBorrowerInfo.loan_amount).div(totalLockedUST) as Rate<Big>;
}
