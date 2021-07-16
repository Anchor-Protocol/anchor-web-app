import type { CW20Addr, ubAsset } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import { max, sum, vectorMultiply } from '@terra-dev/big-math';
import big, { Big } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';
import { vectorizeBAssetSafeLtvs } from './vectorizeBAssetLtvs';
import { vectorizeOraclePrices } from './vectorizeOraclePrices';
import { vectorizeOverseerCollaterals } from './vectorizeOverseerCollaterals';

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
    otherBAssetsSafeLtvs,
  );
  const otherBAssetsCollateralsValueSum = sum(...otherBAssetsCollateralsValue);

  const targetCollateralSafeLtv = bAssetLtvs.get(collateralToken)!.safe;

  // target_collateral_locked - (
  //   (loan_amount - sum([other_collateral_locked] * [other_collateral_oracle_price] * [other_collateral_safe_ltv]))
  //   /
  //   (avg_safe_ltv * target_collateral_oracle_price)
  // )

  const targetCollateralPrice = oraclePrices.prices.find(
    ({ asset }) => collateralToken === asset,
  )!.price;

  const withdrawableAmount = big(targetCollateralLockedAmount).minus(
    big(
      big(marketBorrowerInfo.loan_amount).minus(
        otherBAssetsCollateralsValueSum,
      ),
    ).div(big(targetCollateralSafeLtv).mul(targetCollateralPrice)),
  );

  return max(withdrawableAmount, 0) as ubAsset<Big>;
}
