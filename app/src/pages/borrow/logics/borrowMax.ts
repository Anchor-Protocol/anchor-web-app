import type { Rate, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function borrowMax(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
  bLunaMaxLtv: Rate<BigSource>,
): uUST<Big> {
  return big(bLunaMaxLtv)
    .mul(big(balance).minus(spendable))
    .mul(oraclePrice)
    .minus(loanAmount) as uUST<Big>;
}
