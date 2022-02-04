import { BAssetLtvs, computeBorrowLimit } from '@anchor-protocol/app-fns';
import type { bAsset, CW20Addr, Rate, u } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// export const computeDepositAmountToLtv =
//   (
//     collateralToken: CW20Addr,
//     marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
//     overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
//     oraclePrices: moneyMarket.oracle.PricesResponse,
//   ) =>
//   (depositAmount: u<bAsset<BigSource>>): Rate<Big> => {
//     const collateralsVaue = computeCollateralsTotalUST(
//       overseerCollaterals,
//       oraclePrices,
//       [collateralToken, depositAmount],
//     );

//     return (
//       big(collateralsVaue).eq(0)
//         ? big(0)
//         : big(marketBorrowerInfo.loan_amount).div(collateralsVaue)
//     ) as Rate<Big>;
//   };

export const computeDepositAmountToLtv =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
    bAssetLtvs: BAssetLtvs,
  ) =>
  (depositAmount: u<bAsset<BigSource>>): Rate<Big> => {
    // calculate the new borrow limit taking into account the new deposit amount
    const borrowLimit = computeBorrowLimit(
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
      [collateralToken, depositAmount],
    );

    return (
      big(borrowLimit).eq(0)
        ? big(0)
        : big(marketBorrowerInfo.loan_amount).div(borrowLimit)
    ) as Rate<Big>;
  };
