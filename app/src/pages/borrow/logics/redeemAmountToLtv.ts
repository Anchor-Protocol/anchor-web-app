import type { Rate, ubLuna, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const redeemAmountToLtv = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
) => (redeemAmount: ubLuna<BigSource>): Rate<Big> => {
  return big(loanAmount).div(
    big(big(balance).minus(spendable).minus(redeemAmount)).mul(oraclePrice),
  ) as Rate<Big>;
};
