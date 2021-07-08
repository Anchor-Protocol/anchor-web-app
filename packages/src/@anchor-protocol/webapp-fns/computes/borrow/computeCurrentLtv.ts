import { formatUTokenInteger } from '@anchor-protocol/notation';
import type { Rate } from '@anchor-protocol/types';
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
    console.log(
      'computeCurrentLtv.ts..computeCurrentLtv()',
      formatUTokenInteger(marketBorrowerInfo.loan_amount),
      formatUTokenInteger(collateralsVaue),
    );
    return big(marketBorrowerInfo.loan_amount).div(
      collateralsVaue,
    ) as Rate<Big>;
  } catch {
    return undefined;
  }
}
