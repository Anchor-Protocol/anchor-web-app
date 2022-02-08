import type { Rate, u, UST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const computeRepayAmountToLtv =
  (borrowLimit: u<UST<Big>>, borrowedAmount: u<UST<Big>>) =>
  (repayAmount: u<UST<BigSource>>): Rate<Big> => {
    return borrowedAmount.minus(repayAmount).div(borrowLimit) as Rate<big>;
  };
