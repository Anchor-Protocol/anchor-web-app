import type { Rate, ubAsset } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralTotalLockedUST } from './computeCollateralTotalLockedUST';

// ltv = loanAmount / ((balance - spendable + <amount>) * oracle)
// amount = (loanAmount / (<ltv> * oracle)) + spendable - balance

export const computeLtvToDepositAmount =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (ltv: Rate<BigSource>): ubAsset<Big> => {
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
  };
