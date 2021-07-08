import type { Rate } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket, ubAsset } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralTotalLockedUST } from './computeCollateralTotalLockedUST';

export const computeLtvToRedeemAmount =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (ltv: Rate<BigSource>) => {
    const oracle = oraclePrices.prices.find(
      ({ asset }) => asset === collateralToken,
    );

    if (!oracle) {
      throw new Error(`Can't find oracle of "${collateralToken}"`);
    }

    const totalLockedUST = computeCollateralTotalLockedUST(
      overseerCollaterals,
      oraclePrices,
    );

    const nextTotalLockedUST = big(marketBorrowerInfo.loan_amount).div(ltv);

    const increasedUST = nextTotalLockedUST.minus(totalLockedUST);

    return increasedUST.div(oracle.price) as ubAsset<Big>;

    //return big(borrower.balance).minus(
    //  big(borrowInfo.loan_amount).div(big(ltv).mul(oracle.rate)),
    //) as ubLuna<Big>;
  };
