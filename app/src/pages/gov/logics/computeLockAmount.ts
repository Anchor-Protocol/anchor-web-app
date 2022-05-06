import { Second } from '@libs/types';
import { VotingEscrowConfig } from 'queries';

export const computeLockAmount = (
  config: VotingEscrowConfig,
  period: Second,
): number => {
  return Math.trunc(period / config.periodDuration);
};
