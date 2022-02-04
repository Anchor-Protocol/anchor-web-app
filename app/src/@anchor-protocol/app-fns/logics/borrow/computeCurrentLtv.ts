import type { Rate, u, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { computeCollateralsTotalUST } from './computeCollateralsTotalUST';

export function computeCurrentLtv(
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
): Rate<Big> | undefined {
  const collateralsVaue = computeCollateralsTotalUST(
    overseerCollaterals,
    oraclePrices,
  );

  try {
    return big(marketBorrowerInfo.loan_amount).div(
      collateralsVaue,
    ) as Rate<Big>;
  } catch {
    return undefined;
  }
}

export function computeCurrentLtv2(
  borrowLimit: u<UST<Big>>,
  borrowedAmount: u<UST<Big>>,
): Rate<Big> {
  if (borrowLimit.lte(0)) {
    return big(0) as Rate<big>;
  }
  return borrowedAmount.div(borrowLimit) as Rate<big>;
}
