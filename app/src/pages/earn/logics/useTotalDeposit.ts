import { Ratio, uaUST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useTotalDeposit(
  balance: uaUST<BigSource> | undefined,
  exchangeRate: Ratio<BigSource> | undefined,
): uUST<Big> {
  return useMemo(() => {
    return big(balance ?? '0').mul(exchangeRate ?? '1') as uUST<Big>;
  }, [balance, exchangeRate]);
}
