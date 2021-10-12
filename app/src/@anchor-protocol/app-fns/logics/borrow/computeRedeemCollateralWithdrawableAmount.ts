import type { bAsset, CW20Addr, u } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import { max, min, sum, vectorMultiply } from '@libs/big-math';
import big, { Big } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';
import {
  vectorizeBAssetMaxLtvs,
  vectorizeBAssetSafeLtvs,
} from './vectorizeBAssetLtvs';
import { vectorizeOraclePrices } from './vectorizeOraclePrices';
import { vectorizeOverseerCollaterals } from './vectorizeOverseerCollaterals';

export function computeRedeemCollateralWithdrawableAmount(
  collateralToken: CW20Addr,
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  bAssetLtvs: BAssetLtvs,
): {
  withdrawableAmount: u<bAsset<Big>>;
  withdrawableMaxAmount: u<bAsset<Big>>;
} {
  const targetCollateralLockedAmount =
    overseerCollaterals.collaterals.find(
      ([token]) => collateralToken === token,
    )?.[1] ?? big(0);

  if (big(targetCollateralLockedAmount).lte(0)) {
    return {
      withdrawableAmount: big(0) as u<bAsset<Big>>,
      withdrawableMaxAmount: big(0) as u<bAsset<Big>>,
    };
  }

  const otherBAssetsVector = oraclePrices.prices
    .filter(({ asset }) => asset !== collateralToken)
    .map(({ asset }) => asset);

  const otherBAssetsLockedAmounts = vectorizeOverseerCollaterals(
    otherBAssetsVector,
    overseerCollaterals.collaterals,
  );
  const otherBAssetsPrices = vectorizeOraclePrices(
    otherBAssetsVector,
    oraclePrices.prices,
  );
  const otherBAssetsSafeLtvs = vectorizeBAssetSafeLtvs(
    otherBAssetsVector,
    Array.from(bAssetLtvs),
  );
  const otherBAssetsMaxLtvs = vectorizeBAssetMaxLtvs(
    otherBAssetsVector,
    Array.from(bAssetLtvs),
  );

  const otherBAssetsLockedAmountsUST = vectorMultiply(
    otherBAssetsLockedAmounts,
    otherBAssetsPrices,
  );
  const otherBAssetsCollateralsSafeValue = vectorMultiply(
    otherBAssetsLockedAmountsUST,
    otherBAssetsSafeLtvs,
  );
  const otherBAssetsCollateralsMaxValue = vectorMultiply(
    otherBAssetsLockedAmountsUST,
    otherBAssetsMaxLtvs,
  );
  const otherBAssetsCollateralsSafeValueSum = sum(
    ...otherBAssetsCollateralsSafeValue,
  );
  const otherBAssetsCollateralsMaxValueSum = sum(
    ...otherBAssetsCollateralsMaxValue,
  );

  const targetCollateralSafeLtv = bAssetLtvs.get(collateralToken)!.safe;
  const targetCollateralMaxLtv = bAssetLtvs.get(collateralToken)!.max;

  // remain_loan_amount = loan_amount - min(loan_amount, 다른 collateral 들의 safe_ltv ust 를 빼고)
  // target_locked_amount - (remain_loan_amount / target_oracle_price / target_safe_ltv)

  const targetCollateralPrice = oraclePrices.prices.find(
    ({ asset }) => collateralToken === asset,
  )!.price;

  const withdrawableAmount = big(targetCollateralLockedAmount).minus(
    big(
      big(marketBorrowerInfo.loan_amount).minus(
        min(
          otherBAssetsCollateralsSafeValueSum,
          marketBorrowerInfo.loan_amount,
        ),
      ),
    ).div(big(targetCollateralSafeLtv).mul(targetCollateralPrice)),
  );
  const withdrawableMaxAmount = big(targetCollateralLockedAmount).minus(
    big(
      big(marketBorrowerInfo.loan_amount).minus(
        min(otherBAssetsCollateralsMaxValueSum, marketBorrowerInfo.loan_amount),
      ),
    ).div(big(targetCollateralMaxLtv).mul(targetCollateralPrice)),
  );

  return {
    withdrawableAmount: max(withdrawableAmount, 0) as u<bAsset<Big>>,
    withdrawableMaxAmount: max(withdrawableMaxAmount, 0) as u<bAsset<Big>>,
  };
}
