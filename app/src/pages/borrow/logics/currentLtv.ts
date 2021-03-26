import type { Rate } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function currentLtv(
  borrowInfo: moneyMarket.market.BorrowerInfoResponse,
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
): Rate<Big> | undefined {
  try {
    return big(borrowInfo.loan_amount).div(
      big(big(borrower.balance).minus(borrower.spendable)).mul(oracle.rate),
    ) as Rate<Big>;
  } catch {
    return undefined;
  }
}
