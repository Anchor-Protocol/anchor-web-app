import { Ratio, ubLuna, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export const ltvToRedeemAmount = (
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
) => (ltv: Ratio<BigSource>) => {
  return big(balance).minus(
    big(loanAmount).div(big(ltv).mul(oraclePrice)),
  ) as ubLuna<Big>;
};
