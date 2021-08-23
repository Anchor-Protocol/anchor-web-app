import type { bAsset, Rate, u } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { computeCollateralsTotalUST } from './computeCollateralsTotalUST';

// ltv = loanAmount / ((balance - spendable + <amount>) * oracle)
// amount = (loanAmount / (<ltv> * oracle)) + spendable - balance

export const computeLtvToDepositAmount =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
  ) =>
  (ltv: Rate<BigSource>): u<bAsset<Big>> => {
    const oracle = oraclePrices.prices.find(
      ({ asset }) => asset === collateralToken,
    );

    if (!oracle) {
      throw new Error(`Can't find oracle for "${collateralToken}"`);
    }

    const collateralsVaue = computeCollateralsTotalUST(
      overseerCollaterals,
      oraclePrices,
    );

    const nextCollateralsValue = big(marketBorrowerInfo.loan_amount).div(ltv);

    const increasedUST = nextCollateralsValue.minus(collateralsVaue);

    return increasedUST.div(oracle.price) as u<bAsset<Big>>;
  };
