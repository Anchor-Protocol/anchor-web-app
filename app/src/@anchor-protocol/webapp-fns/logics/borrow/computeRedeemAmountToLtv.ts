import type { Rate, ubAsset } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { computeCollateralsTotalUST } from '@anchor-protocol/webapp-fns';
import big, { Big, BigSource } from 'big.js';

export const computeRedeemAmountToLtv =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (redeemAmount: ubAsset<BigSource>): Rate<Big> => {
    const collateralsVaue = computeCollateralsTotalUST(
      overseerCollaterals,
      oraclePrices,
      [collateralToken, big(redeemAmount).mul(-1) as ubAsset<Big>],
    );

    if (big(collateralsVaue).eq(0)) {
      throw new Error(`totalLockedUST can't be 0`);
    }

    return big(marketBorrowerInfo.loan_amount).div(
      collateralsVaue,
    ) as Rate<Big>;
  };
