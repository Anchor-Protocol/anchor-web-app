import { BAssetLtvs, computeBorrowLimit } from '@anchor-protocol/app-fns';
import type { bAsset, Rate, u } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// export const computeRedeemAmountToLtv =
//   (
//     collateralToken: CW20Addr,
//     marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
//     overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
//     oraclePrices: moneyMarket.oracle.PricesResponse,
//   ) =>
//   (redeemAmount: u<bAsset<BigSource>>): Rate<Big> => {
//     const collateralsVaue = computeCollateralsTotalUST(
//       overseerCollaterals,
//       oraclePrices,
//       [collateralToken, big(redeemAmount).mul(-1) as u<bAsset<Big>>],
//     );

//     if (big(collateralsVaue).eq(0)) {
//       throw new Error(`totalLockedUST can't be 0`);
//     }

//     return big(marketBorrowerInfo.loan_amount).div(
//       collateralsVaue,
//     ) as Rate<Big>;
//   };

export const computeRedeemAmountToLtv =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
    bAssetLtvs: BAssetLtvs,
  ) =>
  (redeemAmount: u<bAsset<BigSource>>): Rate<Big> => {
    const borrowLimit = computeBorrowLimit(
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
      [collateralToken, big(redeemAmount).mul(-1) as u<bAsset<Big>>],
    );

    return (
      big(borrowLimit).eq(0)
        ? big(0)
        : big(marketBorrowerInfo.loan_amount).div(borrowLimit)
    ) as Rate<Big>;
  };
