import type { Rate, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const borrowAmountToLtv = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
) => (borrowAmount: uUST<BigSource>): Rate<Big> => {
  return big(big(loanAmount).plus(borrowAmount)).div(
    big(big(balance).minus(spendable)).mul(oraclePrice),
  ) as Rate<Big>;
};
