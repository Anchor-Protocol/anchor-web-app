import { computeBorrowLimit } from '@anchor-protocol/app-fns';
import type { bAsset, u, UST } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';

// export const computeDepositAmountToBorrowLimit =
//   (
//     collateralToken: CW20Addr,
//     overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
//     oraclePrices: moneyMarket.oracle.PricesResponse,
//     bAssetLtvs: BAssetLtvs,
//     //bLunaMaxLtv: Rate<BigSource>,
//   ) =>
//   (depositAmount: u<bAsset<BigSource>>): u<UST<Big>> => {
//     const vector = oraclePrices.prices.map(({ asset }) => asset);
//     const lockedAmounts = vectorizeOverseerCollaterals(
//       vector,
//       overseerCollaterals.collaterals,
//     );
//     const prices = vectorizeOraclePrices(vector, oraclePrices.prices);
//     const variations = vectorizeVariations(vector, [
//       [collateralToken, depositAmount],
//     ]);
//     const maxLtvs = vectorizeBAssetMaxLtvs(vector, Array.from(bAssetLtvs));

//     // sum(([lockedAmount] + [depositAmount]) * [oraclePrice] * [maxLtv])

//     const bAssetAmounts = vectorPlus(lockedAmounts, variations);
//     const ustAmounts = vectorMultiply(bAssetAmounts, prices);
//     const maxLtvUstAmounts = vectorMultiply(ustAmounts, maxLtvs);

//     return sum(...maxLtvUstAmounts) as u<UST<Big>>;
//   };

export const computeDepositAmountToBorrowLimit =
  (
    collateralToken: CW20Addr,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
    bAssetLtvs: BAssetLtvs,
  ) =>
  (depositAmount: u<bAsset<BigSource>>): u<UST<Big>> => {
    return computeBorrowLimit(overseerCollaterals, oraclePrices, bAssetLtvs, [
      collateralToken,
      depositAmount,
    ]);
  };
