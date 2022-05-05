import { ANC, veANC } from '@anchor-protocol/types';
import { Second } from '@libs/types';
import { BigSource } from 'big.js';

export const computeEstimatedVeAnc = (
  boostCoefficient: number,
  period: Second,
  maxLockTime: Second,
  amount: ANC<BigSource>,
): veANC<BigSource> => {
  return (((boostCoefficient * 0.1 * period) / maxLockTime) *
    Number(amount)) as veANC<BigSource>;
};
