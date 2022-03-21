import {
  ANCHOR_DANGER_RATIO,
  ANCHOR_SAFE_RATIO,
  computeBorrowedAmount,
  computeBorrowLimit,
  computeBorrowMax,
  computeBorrowSafeMax,
  computeLtv,
} from '@anchor-protocol/app-fns';
import {
  DeploymentTarget,
  OverseerWhitelistWithDisplay,
} from '@anchor-protocol/app-provider';
import { CollateralAmount, moneyMarket, Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { CW20Addr, u, UST } from '@libs/types';
import { FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
import { computeBorrowAPR } from '../../logics/borrow/computeBorrowAPR';
import { computeBorrowNextLtv } from '../../logics/borrow/computeBorrowNextLtv';
import { computeBorrowReceiveAmount } from '../../logics/borrow/computeBorrowReceiveAmount';
import { computeBorrowTxFee } from '../../logics/borrow/computeBorrowTxFee';
import { computeEstimateLiquidationPrice } from '../../logics/borrow/computeEstimateLiquidationPrice';
import { validateBorrowAmount } from '../../logics/borrow/validateBorrowAmount';
import { validateTxFee } from '../../logics/common/validateTxFee';
import { BAssetLtvs } from '../../queries/borrow/market';
//import { microfy } from '@anchor-protocol/formatter';

export interface BorrowBorrowFormInput {
  borrowAmount: UST;
  collateralToken?: CW20Addr;
  collateralAmount: CollateralAmount<string>;
}

export interface BorrowBorrowFormDependency {
  target: DeploymentTarget;
  fixedFee: u<UST>;
  userUSTBalance: u<UST>;
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse;
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse;
  oraclePrices: moneyMarket.oracle.PricesResponse;
  borrowRate: moneyMarket.interestModel.BorrowRateResponse;
  overseerWhitelist: OverseerWhitelistWithDisplay;
  bAssetLtvs: BAssetLtvs;
  blocksPerYear: number;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  connected: boolean;
}

export interface BorrowBorrowFormStates extends BorrowBorrowFormInput {
  //amountToLtv: (borrowAmount: u<UST>) => Rate<Big>;
  //ltvToAmount: (ltv: Rate<Big>) => u<UST<Big>>;
  //ltvStepFunction: (draftLtv: Rate<Big>) => Rate<Big>;
  borrowLimit: u<UST<Big>>;
  borrowedAmount: u<UST<Big>>;
  currentLtv: Rate<Big> | undefined;
  userMaxLtv: Rate<BigSource>;
  apr: Rate<Big>;
  safeMax: u<UST<Big>>;
  max: u<UST<Big>>;
  invalidTxFee: string | undefined;
  nextLtv: Rate<Big> | undefined;
  txFee: u<UST<Big>> | undefined;
  estimatedLiquidationPrice: string | null;
  receiveAmount: u<UST<Big>> | undefined;
  invalidBorrowAmount: string | undefined;
  invalidOverMaxLtv: string | undefined;
  warningOverSafeLtv: string | undefined;
  availablePost: boolean;
}

export interface BorrowBorrowFormAsyncStates {}

// export const borrowBorrowForm = ({
//   target,
//   fixedFee,
//   userUSTBalance,
//   marketBorrowerInfo,
//   overseerCollaterals,
//   oraclePrices,
//   borrowRate,
//   overseerWhitelist,
//   bAssetLtvs,
//   blocksPerYear,
//   taxRate,
//   maxTaxUUSD,
//   connected,
// }: BorrowBorrowFormDependency) => {
//   const borrowedAmount = computeBorrowedAmount(marketBorrowerInfo);

//   const borrowLimit = computeBorrowLimit(
//     overseerCollaterals,
//     oraclePrices,
//     bAssetLtvs,
//   );

//   const currentLtv = computeLtv(borrowLimit, borrowedAmount);

//   const amountToLtv = computeBorrowAmountToLtv(borrowLimit, borrowedAmount);

//   const ltvToAmount = computeLtvToBorrowAmount(borrowLimit, borrowedAmount);

//   const apr = computeBorrowAPR(borrowRate, blocksPerYear);

//   const safeMax = computeBorrowSafeMax(borrowLimit, borrowedAmount);

//   const max = computeBorrowMax(borrowLimit, borrowedAmount);

//   const invalidTxFee =
//     connected && target.isNative
//       ? validateTxFee(userUSTBalance, fixedFee)
//       : undefined;

//   const ltvStepFunction = (draftLtv: Rate<Big>): Rate<Big> => {
//     try {
//       const draftAmount = ltvToAmount(draftLtv);
//       return amountToLtv(draftAmount);
//     } catch {
//       return draftLtv;
//     }
//   };

//   return ({
//     borrowAmount,
//     collateralAmount,
//     collateralToken,
//   }: BorrowBorrowFormInput): FormReturn<
//     BorrowBorrowFormStates,
//     BorrowBorrowFormAsyncStates
//   > => {
//     if (collateralToken && collateralAmount.length) {
//       const collateral = pickCollateral(collateralToken, overseerWhitelist);

//       const uCollateralAmount = microfy(
//         collateralAmount,
//         collateral.tokenDisplay?.decimals ?? 6,
//       );

//       const borrowLimit2 = computeBorrowLimit(
//         overseerCollaterals,
//         oraclePrices,
//         bAssetLtvs,
//         [collateralToken, uCollateralAmount],
//       );

//       console.log('borrowLimit', borrowLimit.toString());
//       console.log('borrowLimit2', borrowLimit2.toString());
//     }

//     const nextLtv = computeBorrowNextLtv(borrowAmount, currentLtv, amountToLtv);

//     const estimatedLiquidationPrice = nextLtv
//       ? computeEstimateLiquidationPrice(
//           nextLtv,
//           overseerWhitelist,
//           overseerCollaterals,
//           oraclePrices,
//         )
//       : null;

//     const txFee = target.isNative
//       ? computeBorrowTxFee(borrowAmount, { taxRate, maxTaxUUSD }, fixedFee)
//       : (Big(0) as u<UST<Big>>);

//     const receiveAmount = computeBorrowReceiveAmount(borrowAmount, txFee);

//     const invalidBorrowAmount = validateBorrowAmount(borrowAmount, max);

//     const invalidOverMaxLtv = nextLtv?.gt(ANCHOR_DANGER_RATIO)
//       ? `Cannot borrow when LTV is above ${formatRate(ANCHOR_DANGER_RATIO)}%.`
//       : undefined;

//     const warningOverSafeLtv = nextLtv?.gt(ANCHOR_SAFE_RATIO)
//       ? 'WARNING: Are you sure you want to borrow above the recommended borrow usage? Crypto markets can be very volatile and you may be subject to liquidation in events of downward price swings of the bAsset.'
//       : undefined;

//     const availablePost =
//       connected &&
//       borrowAmount.length > 0 &&
//       big(borrowAmount).gt(0) &&
//       big(receiveAmount ?? 0).gt(0) &&
//       !invalidTxFee &&
//       !invalidBorrowAmount &&
//       !invalidOverMaxLtv;

//     return [
//       {
//         amountToLtv,
//         ltvToAmount,
//         ltvStepFunction,
//         borrowLimit,
//         currentLtv,
//         userMaxLtv: ANCHOR_DANGER_RATIO,
//         apr,
//         safeMax,
//         max,
//         invalidTxFee,
//         nextLtv,
//         txFee,
//         estimatedLiquidationPrice,
//         receiveAmount,
//         invalidBorrowAmount,
//         invalidOverMaxLtv,
//         warningOverSafeLtv,
//         borrowAmount,
//         collateralAmount,
//         collateralToken,
//         availablePost,
//       },
//       undefined,
//     ];
//   };
// };

export const borrowBorrowForm = ({
  target,
  fixedFee,
  userUSTBalance,
  marketBorrowerInfo,
  overseerCollaterals,
  oraclePrices,
  borrowRate,
  overseerWhitelist,
  bAssetLtvs,
  blocksPerYear,
  taxRate,
  maxTaxUUSD,
  connected,
}: BorrowBorrowFormDependency) => {
  const currentBorrowedAmount = computeBorrowedAmount(marketBorrowerInfo);

  // const currentBorrowLimit = computeBorrowLimit(
  //   overseerCollaterals,
  //   oraclePrices,
  //   bAssetLtvs,
  // );

  //const currentLtv = computeLtv(currentBorrowLimit, currentBorrowedAmount);

  //const amountToLtv = computeBorrowAmountToLtv(borrowLimit, borrowedAmount);

  //const ltvToAmount = computeLtvToBorrowAmount(borrowLimit, borrowedAmount);

  const apr = computeBorrowAPR(borrowRate, blocksPerYear);

  // const safeMax = computeBorrowSafeMax(
  //   currentBorrowLimit,
  //   currentBorrowedAmount,
  // );

  //const max = computeBorrowMax(currentBorrowLimit, currentBorrowedAmount);

  const invalidTxFee =
    connected && target.isNative
      ? validateTxFee(userUSTBalance, fixedFee)
      : undefined;

  // const ltvStepFunction = (draftLtv: Rate<Big>): Rate<Big> => {
  //   try {
  //     const draftAmount = ltvToAmount(draftLtv);
  //     return amountToLtv(draftAmount);
  //   } catch {
  //     return draftLtv;
  //   }
  // };

  // const computeAdditionalCollateral = (
  //   collateralToken: CW20Addr | undefined,
  //   collateralAmount: CollateralAmount<string>,
  // ):
  //   | [CW20Addr, u<bAsset<BigSource>> | u<CollateralAmount<BigSource>>]
  //   | undefined => {
  //   if (collateralToken && collateralAmount.length) {
  //     const collateral = pickCollateral(collateralToken, overseerWhitelist);

  //     const uCollateralAmount = microfy(
  //       collateralAmount,
  //       collateral.tokenDisplay?.decimals ?? 6,
  //     );

  //     return [collateralToken, uCollateralAmount];
  //   }

  //   return undefined;
  // };

  return ({
    borrowAmount,
    collateralAmount,
    collateralToken,
  }: BorrowBorrowFormInput): FormReturn<
    BorrowBorrowFormStates,
    BorrowBorrowFormAsyncStates
  > => {
    // let borrowLimit = computeBorrowLimit(
    //   overseerCollaterals,
    //   oraclePrices,
    //   bAssetLtvs,
    // );;

    // if (collateralToken && collateralAmount.length) {
    //   const collateral = pickCollateral(collateralToken, overseerWhitelist);

    //   const uCollateralAmount = microfy(
    //     collateralAmount,
    //     collateral.tokenDisplay?.decimals ?? 6,
    //   );

    //   // borrowLimit = computeBorrowLimit(
    //   //   overseerCollaterals,
    //   //   oraclePrices,
    //   //   bAssetLtvs,
    //   //   [collateralToken, uCollateralAmount],
    //   // );

    //   // console.log('borrowLimit', borrowLimit.toString());
    // }

    // const collateral =
    //   computeAdditionalCollateral(collateralToken, collateralAmount) ?? [];

    const borrowLimit = computeBorrowLimit(
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
    );

    const safeMax = computeBorrowSafeMax(borrowLimit, currentBorrowedAmount);

    const max = computeBorrowMax(borrowLimit, currentBorrowedAmount);

    const currentLtv = computeLtv(borrowLimit, currentBorrowedAmount);

    const nextLtv =
      computeBorrowNextLtv(borrowAmount, borrowLimit, currentBorrowedAmount) ??
      currentLtv;

    const estimatedLiquidationPrice = nextLtv
      ? computeEstimateLiquidationPrice(
          nextLtv,
          overseerWhitelist,
          overseerCollaterals,
          oraclePrices,
        )
      : null;

    const txFee = target.isNative
      ? computeBorrowTxFee(borrowAmount, { taxRate, maxTaxUUSD }, fixedFee)
      : (Big(0) as u<UST<Big>>);

    const receiveAmount = computeBorrowReceiveAmount(borrowAmount, txFee);

    const invalidBorrowAmount = validateBorrowAmount(borrowAmount, max);

    const invalidOverMaxLtv = nextLtv?.gt(ANCHOR_DANGER_RATIO)
      ? `Cannot borrow when LTV is above ${formatRate(ANCHOR_DANGER_RATIO)}%.`
      : undefined;

    const warningOverSafeLtv = nextLtv?.gt(ANCHOR_SAFE_RATIO)
      ? 'WARNING: Are you sure you want to borrow above the recommended borrow usage? Crypto markets can be very volatile and you may be subject to liquidation in events of downward price swings of the bAsset.'
      : undefined;

    const availablePost =
      connected &&
      borrowAmount.length > 0 &&
      big(borrowAmount).gt(0) &&
      big(receiveAmount ?? 0).gt(0) &&
      !invalidTxFee &&
      !invalidBorrowAmount &&
      !invalidOverMaxLtv;

    return [
      {
        borrowLimit,
        borrowedAmount: currentBorrowedAmount,
        currentLtv,
        userMaxLtv: ANCHOR_DANGER_RATIO,
        apr,
        safeMax,
        max,
        invalidTxFee,
        nextLtv,
        txFee,
        estimatedLiquidationPrice,
        receiveAmount,
        invalidBorrowAmount,
        invalidOverMaxLtv,
        warningOverSafeLtv,
        borrowAmount,
        collateralAmount,
        collateralToken,
        availablePost,
      },
      undefined,
    ];
  };
};
