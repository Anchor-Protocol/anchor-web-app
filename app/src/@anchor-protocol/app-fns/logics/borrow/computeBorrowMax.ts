import type { Rate, u, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralsTotalUST } from './computeCollateralsTotalUST';

export function computeBorrowMax(
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  maxLtv: Rate<BigSource>,
): u<UST<Big>> {
  const collateralsVaue = computeCollateralsTotalUST(
    overseerCollaterals,
    oraclePrices,
  );

  return big(maxLtv)
    .mul(collateralsVaue)
    .minus(marketBorrowerInfo.loan_amount) as u<UST<Big>>;
}
