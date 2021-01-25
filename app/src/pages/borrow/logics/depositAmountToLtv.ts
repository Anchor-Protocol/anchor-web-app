import { Ratio, ubLuna, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export const depositAmountToLtv = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
) => (depositAmount: ubLuna<BigSource>): Ratio<Big> => {
  return big(loanAmount).div(
    big(big(balance).minus(spendable).plus(depositAmount)).mul(oraclePrice),
  ) as Ratio<Big>;
};
