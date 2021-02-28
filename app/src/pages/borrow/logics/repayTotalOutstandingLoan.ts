import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function repayTotalOutstandingLoan(
  repayAmount: UST,
  borrowInfo: moneyMarket.market.BorrowInfoResponse,
): uUST<Big> | undefined {
  return repayAmount.length > 0
    ? (big(borrowInfo.loan_amount).minus(microfy(repayAmount)) as uUST<Big>)
    : undefined;
}
