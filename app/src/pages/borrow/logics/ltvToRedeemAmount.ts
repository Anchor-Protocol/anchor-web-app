import type { Rate, ubLuna, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const ltvToRedeemAmount = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
) => (ltv: Rate<BigSource>) => {
  return big(balance).minus(
    big(loanAmount).div(big(ltv).mul(oraclePrice)),
  ) as ubLuna<Big>;
};
