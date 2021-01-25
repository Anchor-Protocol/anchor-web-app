import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function currentLtv(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
): Ratio<Big> | undefined {
  try {
    return big(loanAmount).div(
      big(big(balance).minus(spendable)).mul(oraclePrice),
    ) as Ratio<Big>;
  } catch {
    return undefined;
  }
}
