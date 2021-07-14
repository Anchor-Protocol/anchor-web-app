import type { CW20Addr, ubAsset } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import { avg, max, sum, vectorMultiply } from '@terra-dev/big-math';
import big, { Big } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';
import {
  vectorizeBAssetMaxLtvs,
  vectorizeBAssetSafeLtvs,
} from './vectorizeBAssetLtvs';
import { vectorizeOraclePrices } from './vectorizeOraclePrices';
import { vectorizeOverseerCollaterals } from './vectorizeOverseerCollaterals';

// If user_ltv >= 0.35 or user_ltv == Null:
//   withdrawable = borrow_info.spendable
// else:
//   withdrawable = borrow_info.balance - borrow_info.loan_amount / safe_ltv=0.35 / oracle_price

export function computeRedeemCollateralWithdrawableAmount(
  collateralToken: CW20Addr,
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  bAssetLtvs: BAssetLtvs,
): ubAsset<Big> {
  const targetCollateralLockedAmount =
    overseerCollaterals.collaterals.find(
      ([token]) => collateralToken === token,
    )?.[1] ?? big(0);

  if (big(targetCollateralLockedAmount).lte(0)) {
    return big(0) as ubAsset<Big>;
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
  const otherBAssetsMaxLtvs = vectorizeBAssetMaxLtvs(
    otherBAssetsVector,
    Array.from(bAssetLtvs),
  );
  const otherBAssetsSafeLtvs = vectorizeBAssetSafeLtvs(
    otherBAssetsVector,
    Array.from(bAssetLtvs),
  );

  const otherBAssetsLockedAmountsUST = vectorMultiply(
    otherBAssetsLockedAmounts,
    otherBAssetsPrices,
  );
  const otherBAssetsCollateralsValue = vectorMultiply(
    otherBAssetsLockedAmountsUST,
    otherBAssetsMaxLtvs,
  );
  const otherBAssetsCollateralsValueSum = sum(...otherBAssetsCollateralsValue);

  // target_collateral_locked + (sum([other_collateral_locked] * [other_collateral_oracle_price] * [other_collateral_max_ltv]) - (loan_amount / avg([other_collateral_safe_ltv]))) / (target_collateral_max_ltv * target_collateral_oracle_price)

  const targetCollateralPrice = oraclePrices.prices.find(
    ({ asset }) => collateralToken === asset,
  )!.price;

  const targetCollateralMaxLtv = bAssetLtvs.get(collateralToken)!.max;

  return max(
    big(targetCollateralLockedAmount).plus(
      big(
        otherBAssetsCollateralsValueSum.minus(
          big(marketBorrowerInfo.loan_amount).div(avg(...otherBAssetsSafeLtvs)),
        ),
      ).div(big(targetCollateralMaxLtv).mul(targetCollateralPrice)),
    ),
    0,
  ) as ubAsset<Big>;
}
