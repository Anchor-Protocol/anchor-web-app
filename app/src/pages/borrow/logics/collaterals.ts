import type { Rate, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function collaterals(
  borrower: moneyMarket.custody.BorrowerResponse | undefined,
  oraclePrice: Rate<BigSource> | undefined,
): uUST<Big> {
  return big(big(borrower?.balance ?? 0).minus(borrower?.spendable ?? 0)).mul(
    oraclePrice ?? 1,
  ) as uUST<Big>;
}
