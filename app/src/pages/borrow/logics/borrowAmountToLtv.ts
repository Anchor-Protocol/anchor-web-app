import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export const borrowAmountToLtv = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
) => (borrowAmount: uUST<BigSource>): Ratio<Big> => {
  return big(big(loanAmount).plus(borrowAmount)).div(
    big(big(balance).minus(spendable)).mul(oraclePrice),
  ) as Ratio<Big>;
};
