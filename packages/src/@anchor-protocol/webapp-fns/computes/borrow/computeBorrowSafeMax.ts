import type { Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralTotalLockedUST } from './computeCollateralTotalLockedUST';

// If user_ltv >= 0.35 or user_ltv == Null:
//   SafeMax = 0
// else:
//   safemax = 0.35 * (balance - spendable) * oracle_price - loan_amount

export function computeBorrowSafeMax(
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  safeLtv: Rate<BigSource>,
  currentLtv: Rate<Big> | undefined,
): uUST<Big> {
  const totalLockedUST = computeCollateralTotalLockedUST(
    overseerCollaterals,
    oraclePrices,
  );

  return !currentLtv || currentLtv.gte(safeLtv)
    ? (big(0) as uUST<Big>)
    : (big(safeLtv)
        .mul(totalLockedUST)
        .minus(marketBorrowerInfo.loan_amount) as uUST<Big>);
}
