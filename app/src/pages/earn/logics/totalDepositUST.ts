import type { Rate, uaUST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function totalDepositUST(
  balance: uaUST<BigSource> | undefined,
  exchangeRate: Rate<BigSource> | undefined,
) {
  return big(balance ?? '0').mul(exchangeRate ?? '1') as uUST<Big>;
}
