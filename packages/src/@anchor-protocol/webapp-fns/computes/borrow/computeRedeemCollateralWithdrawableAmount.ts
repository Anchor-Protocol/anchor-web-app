import type { Rate, ubAsset } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// If user_ltv >= 0.35 or user_ltv == Null:
//   withdrawable = borrow_info.spendable
// else:
//   withdrawable = borrow_info.balance - borrow_info.loan_amount / 0.35 / oracle_price

export function computeRedeemCollateralWithdrawableAmount(
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  safeLtv: Rate<BigSource>,
  maxLtv: Rate<BigSource>,
  nextLtv: Rate<Big> | undefined,
): ubAsset<Big> {
  // TODO

  return big(0) as ubAsset<Big>;

  // nextLtv 가 maxLtv 보다 크면 개별 collateral 의 spendable 까지만? (염병... spendable 을 모르고... locked 잖아...)
  // 이건 개별 custody 의 spendable 을 받아야 해결 될 것 같은데...

  //const withdrawable =
  //  !nextLtv || nextLtv.gte(bLunaMaxLtv)
  //    ? big(borrower.spendable)
  //    : big(borrower.balance).minus(
  //        big(borrowInfo.loan_amount).div(bLunaSafeLtv).div(oracle.rate),
  //      );
  //
  //return (withdrawable.lt(0) ? big(0) : withdrawable) as ubLuna<Big>;
}
