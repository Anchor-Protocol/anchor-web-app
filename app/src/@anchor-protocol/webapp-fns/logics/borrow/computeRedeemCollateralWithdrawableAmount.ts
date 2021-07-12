import { formatUTokenInteger } from '@anchor-protocol/notation';
import type { CW20Addr, ubAsset, uToken, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import { max, sum, vectorMultiply } from '@terra-dev/big-math';
import big, { Big } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';
import { vectorizeBAssetSafeLtvs } from './vectorizeBAssetLtvs';
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
  custodyBorrower: moneyMarket.custody.BorrowerResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  bAssetLtvs: BAssetLtvs,
): ubAsset<Big> {
  //return big(big(custodyBorrower.balance).minus(marketBorrowerInfo.loan_amount))
  //  .div(bAssetLtvs.get(collateralToken)!.safe)
  //  .div(
  //    oraclePrices.prices.find(({ asset }) => collateralToken === asset)!.price,
  //  ) as ubAsset<Big>;

  // bAsset 을 되찾는다
  // A:uust = loan_amount 에서 다른 bAsset 들의 금액을 제외 = loan_amount - (다른 bAsset 들의 [locked amount] * [oracle])
  // 되찾을 수 있는 bAsset 수량 = ((현재 bAsset 의 locked amount * oracle) - A) / oracle

  const lockedAmount =
    overseerCollaterals.collaterals.find(
      ([token]) => collateralToken === token,
    )?.[1] ?? big(0);

  if (big(lockedAmount).lte(0)) {
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

  const loanAmount = sum(...otherBAssetsCollateralsValue).minus(
    marketBorrowerInfo.loan_amount,
  ) as uUST<Big>;

  const price = oraclePrices.prices.find(
    ({ asset }) => collateralToken === asset,
  )!.price;

  const safeLtv = bAssetLtvs.get(collateralToken)!.safe;

  const withdrawableUST = big(big(lockedAmount).mul(price)).minus(
    big(loanAmount).mul(safeLtv),
  ) as uUST<Big>;

  console.log(
    'computeRedeemCollateralWithdrawableAmount.ts..computeRedeemCollateralWithdrawableAmount()',
    {
      loanAmount: formatUTokenInteger(marketBorrowerInfo.loan_amount),
      otherBAssetsCollateralsValue: formatUTokenInteger(
        sum(...otherBAssetsCollateralsValue) as uToken<Big>,
      ),
      loanAmount2: formatUTokenInteger(loanAmount),
    },
  );

  return max(withdrawableUST.div(price), 0) as ubAsset<Big>;

  //const withdrawable =
  //  !nextLtv || nextLtv.gte(bLunaMaxLtv)
  //    ? big(borrower.spendable)
  //    : big(borrower.balance).minus(
  //        big(borrowInfo.loan_amount).div(bLunaSafeLtv).div(oracle.rate),
  //      );
  //
  //return (withdrawable.lt(0) ? big(0) : withdrawable) as ubLuna<Big>;
}
