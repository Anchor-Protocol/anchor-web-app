import type { Rate, ubLuna, uUST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const depositAmountToBorrowLimit = (
  borrower: moneyMarket.custody.BorrowerResponse,
  oracle: moneyMarket.oracle.PriceResponse,
  bLunaMaxLtv: Rate<BigSource>,
) => (depositAmount: ubLuna<BigSource>) => {
  return big(
    big(
      big(borrower.balance).minus(borrower.spendable).plus(depositAmount),
    ).mul(oracle.rate),
  ).mul(bLunaMaxLtv) as uUST<Big>;
};
