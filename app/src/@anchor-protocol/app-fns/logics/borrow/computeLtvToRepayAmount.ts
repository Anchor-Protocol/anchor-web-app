import type { Rate, u, UST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const computeLtvToRepayAmount =
  (borrowLimit: u<UST<Big>>, borrowedAmount: u<UST<Big>>) =>
  (ltv: Rate<BigSource>): u<UST<Big>> => {
    return big(borrowedAmount).minus(big(ltv).mul(borrowLimit)) as u<UST<Big>>;
  };
