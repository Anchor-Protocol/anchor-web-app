import type { Rate, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const repayAmountToLtv = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
) => (repayAmount: uUST<BigSource>): Rate<Big> => {
  return big(big(loanAmount).minus(repayAmount)).div(
    big(big(balance).minus(spendable)).mul(oraclePrice),
  ) as Rate<Big>;
};
