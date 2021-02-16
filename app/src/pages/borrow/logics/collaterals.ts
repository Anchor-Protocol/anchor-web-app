import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function collaterals(
  balance: uUST<BigSource> | undefined,
  spendable: uUST<BigSource> | undefined,
  oraclePrice: Ratio<BigSource> | undefined,
): uUST<Big> {
  return big(big(balance ?? 0).minus(spendable ?? 0)).mul(
    oraclePrice ?? 1,
  ) as uUST<Big>;
}
