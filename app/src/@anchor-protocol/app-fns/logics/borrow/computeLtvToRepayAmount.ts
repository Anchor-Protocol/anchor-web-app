import type { Rate, u, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralsTotalUST } from './computeCollateralsTotalUST';

export const computeLtvToRepayAmount =
  (
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (ltv: Rate<BigSource>): u<UST<Big>> => {
    const collateralsVaue = computeCollateralsTotalUST(
      overseerCollaterals,
      oraclePrices,
    );

    return big(marketBorrowerInfo.loan_amount).minus(
      big(ltv).mul(collateralsVaue),
    ) as u<UST<Big>>;
  };
