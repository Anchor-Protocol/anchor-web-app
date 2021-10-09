import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import {
  bAsset,
  CW20Addr,
  moneyMarket,
  Rate,
  u,
  UST,
} from '@anchor-protocol/types';
import { FormReturn } from '@libs/use-form';
import big, { Big } from 'big.js';
import { computeCurrentLtv } from '../../logics/borrow/computeCurrentLtv';
import { computeLtvToRedeemAmount } from '../../logics/borrow/computeLtvToRedeemAmount';
import { computeRedeemAmountToLtv } from '../../logics/borrow/computeRedeemAmountToLtv';
import { computeRedeemCollateralBorrowLimit } from '../../logics/borrow/computeRedeemCollateralBorrowLimit';
import { computeRedeemCollateralNextLtv } from '../../logics/borrow/computeRedeemCollateralNextLtv';
import { computeRedeemCollateralWithdrawableAmount } from '../../logics/borrow/computeRedeemCollateralWithdrawableAmount';
import { pickCollateral } from '../../logics/borrow/pickCollateral';
import { pickCollateralDenom } from '../../logics/borrow/pickCollateralDenom';
import { validateRedeemAmount } from '../../logics/borrow/validateRedeemAmount';
import { validateTxFee } from '../../logics/common/validateTxFee';
import { BAssetLtv, BAssetLtvs } from '../../queries/borrow/market';

export interface BorrowRedeemCollateralFormInput {
  redeemAmount: bAsset;
}

export interface BorrowRedeemCollateralFormDependency {
  collateralToken: CW20Addr;
  fixedFee: u<UST>;
  userUSTBalance: u<UST>;
  userBAssetBalance: u<bAsset>;
  oraclePrices: moneyMarket.oracle.PricesResponse;
  overseerWhitelist: moneyMarket.overseer.WhitelistResponse;
  bAssetLtvs: BAssetLtvs;
  bAssetLtvsAvg: BAssetLtv;
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse;
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse;
  connected: boolean;
}

export interface BorrowRedeemCollateralFormStates
  extends BorrowRedeemCollateralFormInput {
  amountToLtv: (redeemAmount: u<bAsset>) => Rate<Big>;
  ltvToAmount: (ltv: Rate<Big>) => u<bAsset<Big>>;
  ltvStepFunction: (draftLtv: Rate<Big>) => Rate<Big>;

  bAssetLtvsAvg: BAssetLtv;

  collateral: moneyMarket.overseer.WhitelistResponse['elems'][number];
  collateralDenom: COLLATERAL_DENOMS | undefined;

  userMaxLtv: Rate<Big>;
  txFee: u<UST>;
  currentLtv: Rate<Big> | undefined;
  nextLtv: Rate<Big> | undefined;
  withdrawableAmount: u<bAsset<Big>>;
  withdrawableMaxAmount: u<bAsset<Big>>;
  borrowLimit: u<UST<Big>> | undefined;
  invalidTxFee: string | undefined;
  invalidRedeemAmount: string | undefined;

  userBAssetBalance: u<bAsset>;
  availablePost: boolean;
}

export interface BorrowRedeemCollateralFormAsyncStates {}

export const borrowRedeemCollateralForm = ({
  collateralToken,
  fixedFee,
  userUSTBalance,
  userBAssetBalance,
  oraclePrices,
  overseerWhitelist,
  bAssetLtvs,
  bAssetLtvsAvg,
  marketBorrowerInfo,
  overseerCollaterals,
  connected,
}: BorrowRedeemCollateralFormDependency) => {
  const collateral = pickCollateral(collateralToken, overseerWhitelist);

  const collateralDenom = pickCollateralDenom(collateral);

  const amountToLtv = computeRedeemAmountToLtv(
    collateralToken,
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
  );

  const ltvToAmount = computeLtvToRedeemAmount(
    collateralToken,
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
  );

  const userMaxLtv = big(bAssetLtvsAvg.max).minus(0.1) as Rate<Big>;

  const currentLtv = computeCurrentLtv(
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
  );

  return ({
    redeemAmount,
  }: BorrowRedeemCollateralFormInput): FormReturn<
    BorrowRedeemCollateralFormStates,
    BorrowRedeemCollateralFormAsyncStates
  > => {
    const nextLtv = computeRedeemCollateralNextLtv(
      redeemAmount,
      currentLtv,
      amountToLtv,
    );

    const { withdrawableAmount, withdrawableMaxAmount } =
      computeRedeemCollateralWithdrawableAmount(
        collateralToken,
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
        bAssetLtvs,
      );

    const borrowLimit = computeRedeemCollateralBorrowLimit(
      collateralToken,
      redeemAmount,
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
    );

    const invalidTxFee = connected
      ? validateTxFee(userUSTBalance, fixedFee)
      : undefined;

    const invalidRedeemAmount = validateRedeemAmount(
      redeemAmount,
      withdrawableMaxAmount,
    );

    const ltvStepFunction = (draftLtv: Rate<Big>): Rate<Big> => {
      try {
        const draftAmount = ltvToAmount(draftLtv);
        return amountToLtv(draftAmount);
      } catch {
        return draftLtv;
      }
    };

    const availablePost =
      connected &&
      redeemAmount.length > 0 &&
      big(redeemAmount).gt(0) &&
      !invalidTxFee &&
      !invalidRedeemAmount;

    return [
      {
        amountToLtv,
        borrowLimit,
        collateralDenom,
        currentLtv,
        collateral,
        invalidRedeemAmount,
        availablePost,
        redeemAmount,
        ltvToAmount,
        ltvStepFunction,
        bAssetLtvsAvg,
        invalidTxFee,
        nextLtv,
        txFee: fixedFee,
        userMaxLtv,
        withdrawableAmount,
        withdrawableMaxAmount,
        userBAssetBalance,
      },
      undefined,
    ];
  };
};
