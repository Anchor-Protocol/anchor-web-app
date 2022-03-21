import type { Rate, u, UST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const computeBorrowAmountToLtv = (
  amount: u<UST<BigSource>>,
  borrowLimit: u<UST<Big>>,
  borrowedAmount: u<UST<Big>>,
) => {
  return borrowedAmount.plus(amount).div(borrowLimit) as Rate<big>;
};
