import {
  computeBorrowedAmount,
  computeBorrowLimit,
  ANCHOR_SAFE_RATIO,
  ANCHOR_DANGER_RATIO,
} from '@anchor-protocol/app-fns';
import { moneyMarket, Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { u, UST } from '@libs/types';
import { FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
//import { computeBorrowAmountToLtv } from '../../logics/borrow/computeBorrowAmountToLtv';
import { computeBorrowAPR } from '../../logics/borrow/computeBorrowAPR';
//import { computeBorrowMax } from '../../logics/borrow/computeBorrowMax';
import { computeBorrowNextLtv } from '../../logics/borrow/computeBorrowNextLtv';
import { computeBorrowReceiveAmount } from '../../logics/borrow/computeBorrowReceiveAmount';
//import { computeBorrowSafeMax } from '../../logics/borrow/computeBorrowSafeMax';
import { computeBorrowTxFee } from '../../logics/borrow/computeBorrowTxFee';
//import { computeCurrentLtv } from '../../logics/borrow/computeCurrentLtv';
import { computeEstimateLiquidationPrice } from '../../logics/borrow/computeEstimateLiquidationPrice';
//import { computeLtvToBorrowAmount } from '../../logics/borrow/computeLtvToBorrowAmount';
import { validateBorrowAmount } from '../../logics/borrow/validateBorrowAmount';
import { validateTxFee } from '../../logics/common/validateTxFee';
import { BAssetLtv, BAssetLtvs } from '../../queries/borrow/market';

export interface BorrowBorrowFormInput {
  borrowAmount: UST;
}

export interface BorrowBorrowFormDependency {
  fixedFee: u<UST>;
  userUSTBalance: u<UST>;
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse;
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse;
  oraclePrices: moneyMarket.oracle.PricesResponse;
  borrowRate: moneyMarket.interestModel.BorrowRateResponse;
  overseerWhitelist: moneyMarket.overseer.WhitelistResponse;
  bAssetLtvsAvg: BAssetLtv;
  bAssetLtvs: BAssetLtvs;
  blocksPerYear: number;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  connected: boolean;
}

export interface BorrowBorrowFormStates extends BorrowBorrowFormInput {
  amountToLtv: (borrowAmount: u<UST>) => Rate<Big>;
  ltvToAmount: (ltv: Rate<Big>) => u<UST<Big>>;
  ltvStepFunction: (draftLtv: Rate<Big>) => Rate<Big>;

  borrowLimit: u<UST<Big>>;
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

  bAssetLtvsAvg: BAssetLtv;

  availablePost: boolean;
}

export interface BorrowBorrowFormAsyncStates {}

export const borrowBorrowForm = ({
  fixedFee,
  userUSTBalance,
  marketBorrowerInfo,
  overseerCollaterals,
  oraclePrices,
  borrowRate,
  overseerWhitelist,
  bAssetLtvsAvg,
  bAssetLtvs,
  blocksPerYear,
  taxRate,
  maxTaxUUSD,
  connected,
}: BorrowBorrowFormDependency) => {
  // const amountToLtv = computeBorrowAmountToLtv(
  //   marketBorrowerInfo,
  //   overseerCollaterals,
  //   oraclePrices,
  // );

  // const ltvToAmount = computeLtvToBorrowAmount(
  //   marketBorrowerInfo,
  //   overseerCollaterals,
  //   oraclePrices,
  // );

  const borrowedAmount = computeBorrowedAmount(marketBorrowerInfo);
  //const borrowedValue = big(0) as u<UST<big>>;

  // const borrowLimit =
  //   overseerCollaterals && oraclePrices && bAssetLtvs
  //     ? computeBorrowLimit(overseerCollaterals, oraclePrices, bAssetLtvs)
  //     : (big(0) as u<UST<Big>>);
  //const borrowLimit = big(0) as u<UST<big>>;

  const borrowLimit = computeBorrowLimit(
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const amountToLtv = (borrowAmount: u<UST<BigSource>>): Rate<Big> => {
    //return big(1) as Rate<Big>;
    return borrowedAmount.plus(borrowAmount).div(borrowLimit) as Rate<big>;
  };

  //(ltv: Rate<BigSource>): u<UST<Big>>
  const ltvToAmount = (ltv: Rate<BigSource>): u<UST<Big>> => {
    // return big(ltv)
    //   .mul(collateralsVaue)
    //   .minus(marketBorrowerInfo.loan_amount) as u<UST<Big>
    return big(ltv).mul(borrowLimit).minus(borrowedAmount) as u<UST<Big>>;
  };

  // const currentLtv = computeCurrentLtv(
  //   marketBorrowerInfo,
  //   overseerCollaterals,
  //   oraclePrices,
  // ); as Rate<big>
  const currentLtv = borrowedAmount.div(borrowLimit) as Rate<big>;
  // const currentLtv = (
  //   borrowLimit.gte(0) ? borrowedValue.div(borrowLimit) : 0
  // ) as Rate<Big>;

  //const userMaxLtv = big(bAssetLtvsAvg.max).minus(0.1) as Rate<BigSource>;
  //const userMaxLtv = big(ANCHOR_DANGER_RATIO) as Rate<BigSource>;

  const apr = computeBorrowAPR(borrowRate, blocksPerYear);

  // const safeMax = computeBorrowSafeMax(
  //   marketBorrowerInfo,
  //   overseerCollaterals,
  //   oraclePrices,
  //   bAssetLtvsAvg.safe,
  //   currentLtv,
  // );

  // const max = computeBorrowMax(
  //   marketBorrowerInfo,
  //   overseerCollaterals,
  //   oraclePrices,
  //   bAssetLtvsAvg.max,
  // );
  // console.log('max', max.toString());
  const max = borrowLimit.minus(borrowedAmount) as u<UST<Big>>;

  const safeMax = borrowLimit.mul(ANCHOR_SAFE_RATIO).minus(borrowedAmount) as u<
    UST<Big>
  >;

  // console.log('compute::currentLtv', currentLtv?.toString());
  // console.log('compute::borrowedValue', borrowedValue.toString());
  // console.log('compute::borrowLimit', borrowLimit?.toString());
  // console.log(
  //   'compute::borrowRatio',
  //   borrowedValue.div(borrowLimit ?? 0)?.toString(),
  // );

  const invalidTxFee = connected
    ? validateTxFee(userUSTBalance, fixedFee)
    : undefined;

  const ltvStepFunction = (draftLtv: Rate<Big>): Rate<Big> => {
    console.log('ltvStepFunction');
    try {
      const draftAmount = ltvToAmount(draftLtv);
      return amountToLtv(draftAmount);
    } catch {
      return draftLtv;
    }
  };

  return ({
    borrowAmount,
  }: BorrowBorrowFormInput): FormReturn<
    BorrowBorrowFormStates,
    BorrowBorrowFormAsyncStates
  > => {
    const nextLtv = computeBorrowNextLtv(borrowAmount, currentLtv, amountToLtv);

    const txFee = computeBorrowTxFee(
      borrowAmount,
      { taxRate, maxTaxUUSD },
      fixedFee,
    );

    const estimatedLiquidationPrice = nextLtv
      ? computeEstimateLiquidationPrice(
          nextLtv,
          overseerWhitelist,
          overseerCollaterals,
          oraclePrices,
        )
      : null;

    const receiveAmount = computeBorrowReceiveAmount(borrowAmount, txFee);

    const invalidBorrowAmount = validateBorrowAmount(borrowAmount, max);

    const invalidOverMaxLtv = nextLtv?.gt(ANCHOR_DANGER_RATIO)
      ? `Cannot borrow when LTV is above ${formatRate(ANCHOR_DANGER_RATIO)}%.`
      : undefined;

    const warningOverSafeLtv = nextLtv?.gt(ANCHOR_SAFE_RATIO)
      ? 'WARNING: Are you sure you want to borrow above the recommended LTV? Crypto markets can be very volatile and you may be subject to liquidation in events of downward price swings of the bAsset.'
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
        amountToLtv,
        ltvToAmount,
        ltvStepFunction,
        borrowLimit,
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
        bAssetLtvsAvg,
        availablePost,
      },
      undefined,
    ];
  };
};
