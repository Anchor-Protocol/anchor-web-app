import type { Rate, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const ltvToBorrowAmount = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
) => (ltv: Rate<BigSource>): uUST<Big> => {
  return big(ltv)
    .mul(big(balance).minus(spendable).mul(oraclePrice))
    .minus(loanAmount) as uUST<Big>;
};
