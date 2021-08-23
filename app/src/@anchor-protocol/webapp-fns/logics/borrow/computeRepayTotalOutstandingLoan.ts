import type { u, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import big, { Big } from 'big.js';

export function computeRepayTotalOutstandingLoan(
  repayAmount: UST,
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
): u<UST<Big>> | undefined {
  return repayAmount.length > 0
    ? (big(marketBorrowerInfo.loan_amount).minus(microfy(repayAmount)) as u<
        UST<Big>
      >)
    : undefined;
}
