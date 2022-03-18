import {
  ANCHOR_DANGER_RATIO,
  ANCHOR_SAFE_RATIO,
  computeBorrowAmountToLtv,
  computeBorrowedAmount,
  computeBorrowLimit,
  computeBorrowMax,
  computeBorrowSafeMax,
  computeLtv,
  computeLtvToBorrowAmount,
} from '@anchor-protocol/app-fns';
import {
  DeploymentTarget,
  OverseerWhitelistWithDisplay,
} from '@anchor-protocol/app-provider';
import { moneyMarket, Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { u, UST } from '@libs/types';
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

export interface BorrowBorrowFormInput {
  borrowAmount: UST;
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
  availablePost: boolean;
}

export interface BorrowBorrowFormAsyncStates {}

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
  const borrowedAmount = computeBorrowedAmount(marketBorrowerInfo);

  const borrowLimit = computeBorrowLimit(
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const currentLtv = computeLtv(borrowLimit, borrowedAmount);

  const amountToLtv = computeBorrowAmountToLtv(borrowLimit, borrowedAmount);

  const ltvToAmount = computeLtvToBorrowAmount(borrowLimit, borrowedAmount);

  const apr = computeBorrowAPR(borrowRate, blocksPerYear);

  const safeMax = computeBorrowSafeMax(borrowLimit, borrowedAmount);

  const max = computeBorrowMax(borrowLimit, borrowedAmount);

  const invalidTxFee =
    connected && target.isNative
      ? validateTxFee(userUSTBalance, fixedFee)
      : undefined;

  const ltvStepFunction = (draftLtv: Rate<Big>): Rate<Big> => {
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

    const txFee = target.isNative
      ? computeBorrowTxFee(borrowAmount, { taxRate, maxTaxUUSD }, fixedFee)
      : (Big(0) as u<UST<Big>>);

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
        availablePost,
      },
      undefined,
    ];
  };
};
