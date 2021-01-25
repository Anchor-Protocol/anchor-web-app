import { Ratio, ubLuna, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export const redeemAmountToLtv = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
) => (redeemAmount: ubLuna<BigSource>): Ratio<Big> => {
  return big(loanAmount).div(
    big(big(balance).minus(spendable).minus(redeemAmount)).mul(oraclePrice),
  ) as Ratio<Big>;
};
