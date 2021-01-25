import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useCollaterals(
  balance: uUST<BigSource> | undefined,
  spendable: uUST<BigSource> | undefined,
  oraclePrice: Ratio<BigSource> | undefined,
): uUST<Big> {
  return useMemo(() => {
    return big(big(balance ?? 0).minus(spendable ?? 0)).mul(
      oraclePrice ?? 1,
    ) as uUST<Big>;
  }, [balance, oraclePrice, spendable]);
}
