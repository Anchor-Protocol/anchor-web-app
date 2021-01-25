import { Ratio, ubLuna, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

// ltv = loanAmount / ((balance - spendable + <amount>) * oracle)
// amount = (loanAmount / (<ltv> * oracle)) + spendable - balance

export const ltvToDepositAmount = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
) => (ltv: Ratio<BigSource>): ubLuna<Big> => {
  return big(big(loanAmount).div(big(ltv).mul(oraclePrice)))
    .plus(spendable)
    .minus(balance) as ubLuna<Big>;
};
