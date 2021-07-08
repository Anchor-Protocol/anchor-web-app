import type { Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralTotalLockedUST } from './computeCollateralTotalLockedUST';

export const computeLtvToBorrowAmount =
  (
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (ltv: Rate<BigSource>): uUST<Big> => {
    const totalLockedUST = computeCollateralTotalLockedUST(
      overseerCollaterals,
      oraclePrices,
    );

    return big(ltv)
      .mul(totalLockedUST)
      .minus(marketBorrowerInfo.loan_amount) as uUST<Big>;
  };
