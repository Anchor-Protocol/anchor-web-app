import { Second } from '@libs/types';
import { VotingEscrowConfig } from 'queries';

export const computeLockPeriod = (
  config: VotingEscrowConfig,
  amount: number,
): Second => {
  return (amount * config.periodDuration) as Second;
};
