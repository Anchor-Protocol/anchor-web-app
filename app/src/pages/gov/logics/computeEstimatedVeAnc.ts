import { ANC, veANC } from '@anchor-protocol/types';
import { Second } from '@libs/types';
import { BigSource } from 'big.js';

export const computeEstimatedVeAnc = (
  boostCoefficient: number,
  period: Second,
  maxLockTime: Second,
  amount: ANC,
): veANC<BigSource> => {
  return (((boostCoefficient * period) / maxLockTime) *
    Number(amount)) as veANC<BigSource>;
};
