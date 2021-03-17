import type { Rate, ubLuna } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

// If user_ltv >= 0.35 or user_ltv == Null:
//   withdrawable = borrow_info.spendable
// else:
//   withdrawable = borrow_info.balance - borrow_info.loan_amount / 0.35 / oracle_price

export function redeemCollateralWithdrawableAmount(
  borrowInfo: moneyMarket.market.BorrowInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
  bLunaSafeLtv: Rate<BigSource>,
  bLunaMaxLtv: Rate<BigSource>,
  nextLtv: Rate<Big> | undefined,
): ubLuna<Big> {
  const withdrawable =
    !nextLtv || nextLtv.gte(bLunaMaxLtv)
      ? big(borrower.spendable)
      : big(borrower.balance).minus(
          big(borrowInfo.loan_amount).div(bLunaSafeLtv).div(oracle.rate),
        );

  return (withdrawable.lt(0) ? big(0) : withdrawable) as ubLuna<Big>;
}
