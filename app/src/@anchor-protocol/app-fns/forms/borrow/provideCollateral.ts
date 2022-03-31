import {
  computeBorrowedAmount,
  computeBorrowLimit,
} from '@anchor-protocol/app-fns';
import { bAsset, moneyMarket, Rate, u, UST } from '@anchor-protocol/types';
import { FormReturn } from '@libs/use-form';
import big, { Big } from 'big.js';
import { computeLtv } from '../../logics/borrow/computeLtv';
import { computeDepositAmountToBorrowLimit } from '../../logics/borrow/computeDepositAmountToBorrowLimit';
import { computeDepositAmountToLtv } from '../../logics/borrow/computeDepositAmountToLtv';
import { computeLtvToDepositAmount } from '../../logics/borrow/computeLtvToDepositAmount';
import { computeProvideCollateralBorrowLimit } from '../../logics/borrow/computeProvideCollateralBorrowLimit';
import { computeProvideCollateralNextLtv } from '../../logics/borrow/computeProvideCollateralNextLtv';
import { validateDepositAmount } from '../../logics/borrow/validateDepositAmount';
import { validateTxFee } from '../../logics/common/validateTxFee';
import { BAssetLtvs } from '../../queries/borrow/market';
import { computebAssetLtvsAvg } from '@anchor-protocol/app-fns/logics/borrow/computebAssetLtvsAvg';
import { microfy } from '@anchor-protocol/formatter';
import { WhitelistCollateral } from 'queries';

export interface BorrowProvideCollateralFormInput {
  depositAmount: bAsset;
}

export interface BorrowProvideCollateralFormDependency {
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

export interface BorrowProvideCollateralFormStates
  extends BorrowProvideCollateralFormInput {
  amountToLtv: (depositAmount: u<bAsset>) => Rate<Big>;
  ltvToAmount: (ltv: Rate<Big>) => u<bAsset<Big>>;
  ltvStepFunction: (draftLtv: Rate<Big>) => Rate<Big>;
  dangerLtv: Rate<Big>;
  collateral: WhitelistCollateral;
  txFee: u<UST>;
  currentLtv: Rate<Big> | undefined;
  nextLtv: Rate<Big> | undefined;
  borrowLimit: u<UST<Big>>;
  invalidTxFee: string | undefined;
  invalidDepositAmount: string | undefined;
  userBAssetBalance: u<bAsset>;
  availablePost: boolean;
}

export interface BorrowProvideCollateralFormAsyncStates {}

export const borrowProvideCollateralForm = ({
  collateral,
  fixedFee,
  userUSTBalance,
  userBAssetBalance,
  bAssetLtvs,
  overseerCollaterals,
  oraclePrices,
  marketBorrowerInfo,
  connected,
}: BorrowProvideCollateralFormDependency) => {
  const amountToLtv = computeDepositAmountToLtv(
    collateral.collateral_token,
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const ltvToAmount = computeLtvToDepositAmount(
    collateral.collateral_token,
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const amountToBorrowLimit = computeDepositAmountToBorrowLimit(
    collateral.collateral_token,
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const borrowedAmount = computeBorrowedAmount(marketBorrowerInfo);

  const borrowLimit = computeBorrowLimit(
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const currentLtv = computeLtv(borrowLimit, borrowedAmount);

  const bAssetLtvsAvg = computebAssetLtvsAvg(bAssetLtvs);

  const dangerLtv = big(bAssetLtvsAvg.max).minus(0.1) as Rate<Big>;

  const invalidTxFee = connected
    ? validateTxFee(userUSTBalance, fixedFee)
    : undefined;

  const ltvStepFunction = (draftLtv: Rate<Big>): Rate<Big> => {
    try {
      return amountToLtv(ltvToAmount(draftLtv));
    } catch {
      return draftLtv;
    }
  };

  return ({
    depositAmount,
  }: BorrowProvideCollateralFormInput): FormReturn<
    BorrowProvideCollateralFormStates,
    BorrowProvideCollateralFormAsyncStates
  > => {
    const amount =
      depositAmount.length > 0
        ? microfy(depositAmount, collateral.decimals)
        : ('0' as u<bAsset>);

    const nextLtv = computeProvideCollateralNextLtv(
      amount,
      currentLtv,
      amountToLtv,
    );

    const borrowLimit = computeProvideCollateralBorrowLimit(
      amount,
      amountToBorrowLimit,
    );

    const invalidDepositAmount = validateDepositAmount(
      amount,
      userBAssetBalance,
    );

    const availablePost =
      connected &&
      depositAmount.length > 0 &&
      big(amount).gt(0) &&
      !invalidTxFee &&
      !invalidDepositAmount;

    return [
      {
        depositAmount,
        collateral,
        borrowLimit,
        currentLtv,
        amountToLtv,
        ltvStepFunction,
        dangerLtv,
        invalidDepositAmount,
        invalidTxFee,
        nextLtv,
        ltvToAmount,
        userBAssetBalance,
        availablePost,
        txFee: fixedFee,
      },
      undefined,
    ];
  };
};
