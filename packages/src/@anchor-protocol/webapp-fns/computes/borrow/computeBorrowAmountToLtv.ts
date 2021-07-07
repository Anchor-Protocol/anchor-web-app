import type { Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralTotalUST } from './computeCollateralTotalUST';

export const computeBorrowAmountToLtv =
  (
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (borrowAmount: uUST<BigSource>): Rate<Big> => {
    const collateralTotalUST = computeCollateralTotalUST(
      overseerCollaterals,
      oraclePrices,
    );

    return big(big(marketBorrowerInfo.loan_amount).plus(borrowAmount)).div(
      collateralTotalUST,
    ) as Rate<Big>;
  };
