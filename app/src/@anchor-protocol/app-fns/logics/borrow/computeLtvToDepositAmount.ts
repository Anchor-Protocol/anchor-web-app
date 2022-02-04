import {
  BAssetLtvs,
  computeBorrowedAmount,
  computeBorrowLimit,
  vectorizeOraclePrices,
} from '@anchor-protocol/app-fns';
import type { bAsset, Rate, u } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

export const computeLtvToDepositAmount =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
    bAssetLtvs: BAssetLtvs,
  ) =>
  (ltv: Rate<BigSource>): u<bAsset<Big>> => {
    const borrowLimit = computeBorrowLimit(
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
    );

    const prices = vectorizeOraclePrices(
      [collateralToken],
      oraclePrices.prices,
    );

    const borrowedAmount = computeBorrowedAmount(marketBorrowerInfo);

    const increasedAmount = borrowedAmount.div(ltv).minus(borrowLimit);

    return increasedAmount.div(prices[0]) as u<bAsset<Big>>;
  };

// export const computeLtvToDepositAmount =
//   (
//     collateralToken: CW20Addr,
//     marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
//     overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
//     oraclePrices: moneyMarket.oracle.PricesResponse,
//     bAssetLtvs: BAssetLtvs,
//   ) =>
//   (ltv: Rate<BigSource>): u<bAsset<Big>> => {
//     const oracle = oraclePrices.prices.find(
//       ({ asset }) => asset === collateralToken,
//     );

//     if (!oracle) {
//       throw new Error(`Can't find oracle for "${collateralToken}"`);
//     }

//     const collateralsVaue = computeCollateralsTotalUST(
//       overseerCollaterals,
//       oraclePrices,
//     );

//     const nextCollateralsValue = big(marketBorrowerInfo.loan_amount).div(ltv);

//     const increasedUST = nextCollateralsValue.minus(collateralsVaue);

//     return increasedUST.div(oracle.price) as u<bAsset<Big>>;
//   };
