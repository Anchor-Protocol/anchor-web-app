import type { Rate, ubLuna, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const depositAmountToLtv = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
) => (depositAmount: ubLuna<BigSource>): Rate<Big> => {
  return big(loanAmount).div(
    big(big(balance).minus(spendable).plus(depositAmount)).mul(oraclePrice),
  ) as Rate<Big>;
};
