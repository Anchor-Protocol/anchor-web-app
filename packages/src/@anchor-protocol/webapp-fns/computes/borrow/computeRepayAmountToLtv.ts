import { moneyMarket } from '@anchor-protocol/types';
import type { Rate, uUST } from '@anchor-protocol/types';
import { computeCollateralTotalLockedUST } from './computeCollateralTotalLockedUST';
import big, { Big, BigSource } from 'big.js';

export const computeRepayAmountToLtv =
  (
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (repayAmount: uUST<BigSource>): Rate<Big> => {
    const totalLockedUST = computeCollateralTotalLockedUST(
      overseerCollaterals,
      oraclePrices,
    );

    return big(big(marketBorrowerInfo.loan_amount).minus(repayAmount)).div(
      totalLockedUST,
    ) as Rate<Big>;
  };
