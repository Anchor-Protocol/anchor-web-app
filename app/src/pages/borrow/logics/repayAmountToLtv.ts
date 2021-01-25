import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export const repayAmountToLtv = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
) => (repayAmount: uUST<BigSource>): Ratio<Big> => {
  return big(big(loanAmount).minus(repayAmount)).div(
    big(big(balance).minus(spendable)).mul(oraclePrice),
  ) as Ratio<Big>;
};
