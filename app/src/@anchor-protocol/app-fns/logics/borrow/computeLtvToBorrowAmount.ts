import type { Rate, u, UST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const computeLtvToBorrowAmount =
  (borrowLimit: u<UST<Big>>, borrowedAmount: u<UST<Big>>) =>
  (ltv: Rate<BigSource>): u<UST<Big>> => {
    return big(ltv).mul(borrowLimit).minus(borrowedAmount) as u<UST<Big>>;
  };
