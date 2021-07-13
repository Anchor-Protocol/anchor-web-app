import type { CW20Addr, ubAsset } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import { max } from '@terra-dev/big-math';
import big, { Big } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';

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
  const lockedAmount =
    overseerCollaterals.collaterals.find(
      ([token]) => collateralToken === token,
    )?.[1] ?? big(0);

  if (big(lockedAmount).lte(0)) {
    return big(0) as ubAsset<Big>;
  }

  const price = oraclePrices.prices.find(
    ({ asset }) => collateralToken === asset,
  )!.price;

  const safeLtv = bAssetLtvs.get(collateralToken)!.safe;

  return max(
    big(lockedAmount).minus(
      big(marketBorrowerInfo.loan_amount).div(safeLtv).div(price),
    ),
    0,
  ) as ubAsset<Big>;

  //const withdrawable =
  //  !nextLtv || nextLtv.gte(bLunaMaxLtv)
  //    ? big(borrower.spendable)
  //    : big(borrower.balance).minus(
  //        big(borrowInfo.loan_amount).div(bLunaSafeLtv).div(oracle.rate),
  //      );
  //
  //return (withdrawable.lt(0) ? big(0) : withdrawable) as ubLuna<Big>;
}
