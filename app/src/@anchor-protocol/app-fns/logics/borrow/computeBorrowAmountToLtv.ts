import type { Rate, u, UST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const computeBorrowAmountToLtv =
  (borrowLimit: u<UST<Big>>, borrowedAmount: u<UST<Big>>) =>
  (borrowAmount: u<UST<BigSource>>): Rate<Big> => {
    return borrowedAmount.plus(borrowAmount).div(borrowLimit) as Rate<big>;
  };
