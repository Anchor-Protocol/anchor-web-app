import {
  computeBorrowedAmount,
  computeBorrowLimit,
  computeLtv,
} from '@anchor-protocol/app-fns';
import { bAsset, moneyMarket, Rate, u, UST } from '@anchor-protocol/types';
import { FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
import { computeLtvToRedeemAmount } from '../../logics/borrow/computeLtvToRedeemAmount';
import { computeRedeemAmountToLtv } from '../../logics/borrow/computeRedeemAmountToLtv';
import { computeRedeemCollateralBorrowLimit } from '../../logics/borrow/computeRedeemCollateralBorrowLimit';
import { computeRedeemCollateralNextLtv } from '../../logics/borrow/computeRedeemCollateralNextLtv';
import { validateRedeemAmount } from '../../logics/borrow/validateRedeemAmount';
import { validateTxFee } from '../../logics/common/validateTxFee';
import { BAssetLtvs } from '../../queries/borrow/market';
import { computebAssetLtvsAvg } from '@anchor-protocol/app-fns/logics/borrow/computebAssetLtvsAvg';
import { microfy } from '@anchor-protocol/formatter';
import { WhitelistCollateral } from 'queries';

export interface BorrowRedeemCollateralFormInput {
  redeemAmount: bAsset;
}

export interface BorrowRedeemCollateralFormDependency {
  collateral: WhitelistCollateral;
  fixedFee: u<UST>;
  userUSTBalance: u<UST>;
  userBAssetBalance: u<bAsset>;
  oraclePrices: moneyMarket.oracle.PricesResponse;
  bAssetLtvs: BAssetLtvs;
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse;
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse;
  connected: boolean;
}

export interface BorrowRedeemCollateralFormStates
  extends BorrowRedeemCollateralFormInput {
  amountToLtv: (redeemAmount: u<bAsset>) => Rate<Big>;
  ltvToAmount: (ltv: Rate<Big>) => u<bAsset<Big>>;
  ltvStepFunction: (draftLtv: Rate<Big>) => Rate<Big>;
  collateral: WhitelistCollateral;
  userMaxLtv: Rate<Big>;
  txFee: u<UST>;
  currentLtv: Rate<Big> | undefined;
  nextLtv: Rate<Big> | undefined;
  withdrawableAmount: u<bAsset<Big>>;
  withdrawableMaxAmount: u<bAsset<Big>>;
  borrowLimit: u<UST<Big>>;
  invalidTxFee: string | undefined;
  invalidRedeemAmount: string | undefined;
  userBAssetBalance: u<bAsset>;
  availablePost: boolean;
}

export interface BorrowRedeemCollateralFormAsyncStates {}

export const borrowRedeemCollateralForm = ({
  collateral,
  fixedFee,
  userUSTBalance,
  userBAssetBalance,
  oraclePrices,
  bAssetLtvs,
  marketBorrowerInfo,
  overseerCollaterals,
  connected,
}: BorrowRedeemCollateralFormDependency) => {
  const amountToLtv = computeRedeemAmountToLtv(
    collateral.collateral_token,
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const ltvToAmount = computeLtvToRedeemAmount(
    collateral.collateral_token,
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const bAssetLtvsAvg = computebAssetLtvsAvg(bAssetLtvs);

  const userMaxLtv = big(bAssetLtvsAvg.max).minus(0.1) as Rate<Big>;

  const currentLtv = computeLtv(
    computeBorrowLimit(overseerCollaterals, oraclePrices, bAssetLtvs),
    computeBorrowedAmount(marketBorrowerInfo),
  );

  const ltvStepFunction = (draftLtv: Rate<Big>): Rate<Big> => {
    try {
      return amountToLtv(ltvToAmount(draftLtv));
    } catch {
      return draftLtv;
    }
  };

  return ({
    redeemAmount,
  }: BorrowRedeemCollateralFormInput): FormReturn<
    BorrowRedeemCollateralFormStates,
    BorrowRedeemCollateralFormAsyncStates
  > => {
    const amount =
      redeemAmount.length > 0
        ? microfy(redeemAmount, collateral.decimals)
        : ('0' as u<bAsset>);

    const nextLtv = computeRedeemCollateralNextLtv(
      amount,
      currentLtv,
      amountToLtv,
    );

    const withdrawableAmount = ltvToAmount(0.75 as Rate<BigSource>);

    const withdrawableMaxAmount = ltvToAmount(1 as Rate<BigSource>);

    const borrowLimit = computeRedeemCollateralBorrowLimit(
      collateral.collateral_token,
      amount,
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
    );

    const invalidTxFee = connected
      ? validateTxFee(userUSTBalance, fixedFee)
      : undefined;

    const invalidRedeemAmount = validateRedeemAmount(
      amount,
      withdrawableMaxAmount,
    );

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
        currentLtv,
        collateral,
        invalidRedeemAmount,
        availablePost,
        redeemAmount,
        ltvToAmount,
        ltvStepFunction,
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
