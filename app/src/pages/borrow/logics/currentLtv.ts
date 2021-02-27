import type { Rate, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function currentLtv(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
): Rate<Big> | undefined {
  try {
    return big(loanAmount).div(
      big(big(balance).minus(spendable)).mul(oraclePrice),
    ) as Rate<Big>;
  } catch {
    return undefined;
  }
}
