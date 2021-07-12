import { moneyMarket } from '@anchor-protocol/types';
import type { Rate, uUST } from '@anchor-protocol/types';
import { computeCollateralsTotalUST } from './computeCollateralsTotalUST';
import big, { Big, BigSource } from 'big.js';

export const computeRepayAmountToLtv =
  (
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (repayAmount: uUST<BigSource>): Rate<Big> => {
    const collateralsVaue = computeCollateralsTotalUST(
      overseerCollaterals,
      oraclePrices,
    );

    return big(big(marketBorrowerInfo.loan_amount).minus(repayAmount)).div(
      collateralsVaue,
    ) as Rate<Big>;
  };
