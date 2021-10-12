import type { Rate, u, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralsTotalUST } from './computeCollateralsTotalUST';

export const computeRepayAmountToLtv =
  (
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (repayAmount: u<UST<BigSource>>): Rate<Big> => {
    const collateralsVaue = computeCollateralsTotalUST(
      overseerCollaterals,
      oraclePrices,
    );

    return big(big(marketBorrowerInfo.loan_amount).minus(repayAmount)).div(
      collateralsVaue,
    ) as Rate<Big>;
  };
