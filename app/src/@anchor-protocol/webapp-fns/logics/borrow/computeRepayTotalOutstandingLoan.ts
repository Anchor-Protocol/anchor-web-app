import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeRepayTotalOutstandingLoan(
  repayAmount: UST,
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
): uUST<Big> | undefined {
  return repayAmount.length > 0
    ? (big(marketBorrowerInfo.loan_amount).minus(
        microfy(repayAmount),
      ) as uUST<Big>)
    : undefined;
}
