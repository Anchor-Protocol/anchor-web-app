import type { CW20Addr, Rate, ubAsset } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralTotalLockedUST } from './computeCollateralTotalLockedUST';

export const computeDepositAmountToLtv =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (depositAmount: ubAsset<BigSource>): Rate<Big> => {
    const totalLockedUST = computeCollateralTotalLockedUST(
      overseerCollaterals,
      oraclePrices,
      [collateralToken, depositAmount],
    );

    return big(marketBorrowerInfo.loan_amount).div(totalLockedUST) as Rate<Big>;
  };
