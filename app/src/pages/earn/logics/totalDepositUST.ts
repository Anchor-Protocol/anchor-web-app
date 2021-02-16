import { Ratio, uaUST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function totalDepositUST(
  balance: uaUST<BigSource> | undefined,
  exchangeRate: Ratio<BigSource> | undefined,
) {
  return big(balance ?? '0').mul(exchangeRate ?? '1') as uUST<Big>;
}
