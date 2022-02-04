import {
  BAssetLtvs,
  computeBorrowedAmount,
  computeBorrowLimit,
  vectorizeOraclePrices,
} from '@anchor-protocol/app-fns';
import type { Rate } from '@anchor-protocol/types';
import { bAsset, CW20Addr, moneyMarket, u } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

// export const computeLtvToRedeemAmount =
//   (
//     collateralToken: CW20Addr,
//     marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
//     overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
//     oraclePrices: moneyMarket.oracle.PricesResponse,
//   ) =>
//   (ltv: Rate<BigSource>) => {
//     const oracle = oraclePrices.prices.find(
//       ({ asset }) => asset === collateralToken,
//     );

//     if (!oracle) {
//       throw new Error(`Can't find oracle of "${collateralToken}"`);
//     }

//     const collateralsVaue = computeCollateralsTotalUST(
//       overseerCollaterals,
//       oraclePrices,
//     );

//     const nextTotalLockedUST = big(marketBorrowerInfo.loan_amount).div(ltv);

//     const increasedUST = collateralsVaue.minus(nextTotalLockedUST);

//     return increasedUST.div(oracle.price) as u<bAsset<Big>>;
//   };

export const computeLtvToRedeemAmount =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
    bAssetLtvs: BAssetLtvs,
  ) =>
  (ltv: Rate<BigSource>) => {
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

    const increasedAmount = borrowLimit.minus(borrowedAmount.div(ltv));

    return increasedAmount.div(prices[0]) as u<bAsset<Big>>;
  };
