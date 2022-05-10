import { veANC } from '@anchor-protocol/types';
import Big, { BigSource } from 'big.js';

export const computeGaugeVoteRatio = (
  amount: veANC<BigSource>,
  total: veANC<BigSource>,
) => {
  return Math.round(Big(amount).div(total).mul(10000).toNumber());
};
