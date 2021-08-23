import type { Rate, u, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralsTotalUST } from './computeCollateralsTotalUST';

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
): u<UST<Big>> {
  const collateralsVaue = computeCollateralsTotalUST(
    overseerCollaterals,
    oraclePrices,
  );

  return !currentLtv || currentLtv.gte(safeLtv)
    ? (big(0) as u<UST<Big>>)
    : (big(safeLtv)
        .mul(collateralsVaue)
        .minus(marketBorrowerInfo.loan_amount) as u<UST<Big>>);
}
