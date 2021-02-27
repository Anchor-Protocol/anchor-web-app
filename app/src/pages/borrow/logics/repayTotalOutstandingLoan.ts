import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function repayTotalOutstandingLoan(
  repayAmount: UST,
  loanAmount: uUST<BigSource>,
): uUST<Big> | undefined {
  return repayAmount.length > 0
    ? (big(loanAmount).minus(microfy(repayAmount)) as uUST<Big>)
    : undefined;
}
