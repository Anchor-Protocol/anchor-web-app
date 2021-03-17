import type { Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function borrowMax(
  borrowInfo: moneyMarket.market.BorrowInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
  bLunaMaxLtv: Rate<BigSource>,
): uUST<Big> {
  return big(bLunaMaxLtv)
    .mul(big(borrower.balance).minus(borrower.spendable))
    .mul(oracle.rate)
    .minus(borrowInfo.loan_amount) as uUST<Big>;
}
