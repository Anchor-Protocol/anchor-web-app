import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function borrowMax(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
  bLunaMaxLtv: Ratio<BigSource>,
): uUST<Big> {
  return big(bLunaMaxLtv)
    .mul(big(balance).minus(spendable))
    .mul(oraclePrice)
    .minus(loanAmount) as uUST<Big>;
}
