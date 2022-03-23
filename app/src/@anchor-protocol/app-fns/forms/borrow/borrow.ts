import {
  ANCHOR_DANGER_RATIO,
  ANCHOR_SAFE_RATIO,
  computeBorrowedAmount,
  computeBorrowLimit,
  computeBorrowMax,
  computeBorrowSafeMax,
  computeLtv,
  pickCollateral,
} from '@anchor-protocol/app-fns';
import {
  DeploymentTarget,
  OverseerWhitelistWithDisplay,
} from '@anchor-protocol/app-provider';
import {
  bAsset,
  CollateralAmount,
  moneyMarket,
  Rate,
} from '@anchor-protocol/types';
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
import { microfy } from '@anchor-protocol/formatter';

export interface BorrowBorrowFormInput {
  borrowAmount: UST;
  collateralToken?: CW20Addr;
  collateralAmount?: u<CollateralAmount<Big>>;
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
  maxCollateralAmount: u<CollateralAmount<Big>>;
  collateralLtv: Rate<Big>;
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

  const apr = computeBorrowAPR(borrowRate, blocksPerYear);

  const invalidTxFee =
    connected && target.isNative
      ? validateTxFee(userUSTBalance, fixedFee)
      : undefined;

  const computeAdditionalCollateral = (
    collateralToken: CW20Addr | undefined,
    collateralAmount: CollateralAmount<Big> | undefined,
  ): Array<
    [CW20Addr, u<bAsset<BigSource>> | u<CollateralAmount<BigSource>>]
  > => {
    if (collateralToken && collateralAmount) {
      const collateral = pickCollateral(collateralToken, overseerWhitelist);

      const uCollateralAmount = microfy(
        collateralAmount,
        collateral.tokenDisplay?.decimals ?? 6,
      );

      return [[collateralToken, uCollateralAmount]];
    }

    return [];
  };

  return ({
    borrowAmount,
    collateralAmount,
    collateralToken,
  }: BorrowBorrowFormInput): FormReturn<
    BorrowBorrowFormStates,
    BorrowBorrowFormAsyncStates
  > => {
    const collateral = computeAdditionalCollateral(
      collateralToken,
      collateralAmount,
    );

    const borrowLimit = computeBorrowLimit(
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
      collateral,
    );

    const safeMax = computeBorrowSafeMax(borrowLimit, borrowedAmount);

    const max = computeBorrowMax(borrowLimit, borrowedAmount);

    const currentLtv = computeLtv(borrowLimit, borrowedAmount);

    const nextLtv =
      computeBorrowNextLtv(borrowAmount, borrowLimit, borrowedAmount) ??
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

    const maxCollateralAmount = Big(100000000) as u<CollateralAmount<Big>>;

    const collateralLtv = (
      collateralAmount ? collateralAmount.div(maxCollateralAmount) : Big(0)
    ) as Rate<Big>;

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
        borrowedAmount,
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
        maxCollateralAmount,
        collateralLtv,
      },
      undefined,
    ];
  };
};
