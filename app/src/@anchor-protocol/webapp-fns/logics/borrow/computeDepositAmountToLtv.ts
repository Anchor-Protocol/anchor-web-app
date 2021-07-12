import type { CW20Addr, Rate, ubAsset } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralsTotalUST } from './computeCollateralsTotalUST';

export const computeDepositAmountToLtv =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (depositAmount: ubAsset<BigSource>): Rate<Big> => {
    const collateralsVaue = computeCollateralsTotalUST(
      overseerCollaterals,
      oraclePrices,
      [collateralToken, depositAmount],
    );

    return (
      big(collateralsVaue).eq(0)
        ? big(0)
        : big(marketBorrowerInfo.loan_amount).div(collateralsVaue)
    ) as Rate<Big>;
  };
