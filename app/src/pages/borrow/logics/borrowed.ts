import type { uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function borrowed(
  borrowInfo: moneyMarket.market.BorrowInfoResponse | undefined,
): uUST<Big> {
  return big(borrowInfo?.loan_amount ?? 0) as uUST<Big>;
}
