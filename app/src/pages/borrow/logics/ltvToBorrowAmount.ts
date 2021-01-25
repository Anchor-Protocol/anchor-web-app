import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export const ltvToBorrowAmount = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
) => (ltv: Ratio<BigSource>): uUST<Big> => {
  return big(ltv)
    .mul(big(balance).minus(spendable).mul(oraclePrice))
    .minus(loanAmount) as uUST<Big>;
};
