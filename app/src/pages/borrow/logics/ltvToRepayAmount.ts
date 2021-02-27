import type { Rate, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const ltvToRepayAmount = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
) => (ltv: Rate<BigSource>): uUST<Big> => {
  return big(loanAmount).minus(
    big(ltv).mul(big(big(balance).minus(spendable)).mul(oraclePrice)),
  ) as uUST<Big>;
};
