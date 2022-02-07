import { OverseerWhitelistWithDisplay } from '@anchor-protocol/app-provider';
import {
  computeBorrowedAmount,
  computeBorrowLimit,
} from '@anchor-protocol/app-fns';
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
import { computeLtv } from '../../logics/borrow/computeLtv';
import { computeDepositAmountToBorrowLimit } from '../../logics/borrow/computeDepositAmountToBorrowLimit';
import { computeDepositAmountToLtv } from '../../logics/borrow/computeDepositAmountToLtv';
import { computeLtvToDepositAmount } from '../../logics/borrow/computeLtvToDepositAmount';
import { computeProvideCollateralBorrowLimit } from '../../logics/borrow/computeProvideCollateralBorrowLimit';
import { computeProvideCollateralNextLtv } from '../../logics/borrow/computeProvideCollateralNextLtv';
import { pickCollateral } from '../../logics/borrow/pickCollateral';
import { validateDepositAmount } from '../../logics/borrow/validateDepositAmount';
import { validateTxFee } from '../../logics/common/validateTxFee';
import { BAssetLtv, BAssetLtvs } from '../../queries/borrow/market';

export interface BorrowProvideCollateralFormInput {
  depositAmount: bAsset;
}

export interface BorrowProvideCollateralFormDependency {
  collateralToken: CW20Addr;
  fixedFee: u<UST>;
  userUSTBalance: u<UST>;
  userBAssetBalance: u<bAsset>;
  oraclePrices: moneyMarket.oracle.PricesResponse;
  overseerWhitelist: OverseerWhitelistWithDisplay;
  bAssetLtvs: BAssetLtvs;
  bAssetLtvsAvg: BAssetLtv;
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse;
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse;
  connected: boolean;
}

export interface BorrowProvideCollateralFormStates
  extends BorrowProvideCollateralFormInput {
  amountToLtv: (depositAmount: u<bAsset>) => Rate<Big>;
  ltvToAmount: (ltv: Rate<Big>) => u<bAsset<Big>>;
  ltvStepFunction: (draftLtv: Rate<Big>) => Rate<Big>;

  bAssetLtvsAvg: BAssetLtv;

  dangerLtv: Rate<Big>;
  collateral: OverseerWhitelistWithDisplay['elems'][0];
  //collateralDenom: COLLATERAL_DENOMS | undefined;

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
  collateralToken,
  fixedFee,
  userUSTBalance,
  userBAssetBalance,
  bAssetLtvs,
  bAssetLtvsAvg,
  overseerWhitelist,
  overseerCollaterals,
  oraclePrices,
  marketBorrowerInfo,
  connected,
}: BorrowProvideCollateralFormDependency) => {
  const amountToLtv = computeDepositAmountToLtv(
    collateralToken,
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const ltvToAmount = computeLtvToDepositAmount(
    collateralToken,
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const amountToBorrowLimit = computeDepositAmountToBorrowLimit(
    collateralToken,
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

  const dangerLtv = big(bAssetLtvsAvg.max).minus(0.1) as Rate<Big>;

  const collateral = pickCollateral(collateralToken, overseerWhitelist);

  const invalidTxFee = connected
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
    depositAmount,
  }: BorrowProvideCollateralFormInput): FormReturn<
    BorrowProvideCollateralFormStates,
    BorrowProvideCollateralFormAsyncStates
  > => {
    const nextLtv = computeProvideCollateralNextLtv(
      depositAmount,
      currentLtv,
      amountToLtv,
    );

    const borrowLimit = computeProvideCollateralBorrowLimit(
      depositAmount,
      amountToBorrowLimit,
    );

    const invalidDepositAmount = validateDepositAmount(
      depositAmount,
      userBAssetBalance,
    );

    const availablePost =
      connected &&
      depositAmount.length > 0 &&
      big(depositAmount).gt(0) &&
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
        bAssetLtvsAvg,
        txFee: fixedFee,
      },
      undefined,
    ];
  };
};
