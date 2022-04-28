import { Second } from '@libs/types';
import { useMemo } from 'react';
import { useMyLockInfoQuery } from './useMyLockInfo';
import { useVotingEscrowConfigQuery } from './useVotingEscrowConfigQuery';

export const useMyVotingLockPeriod = () => {
  const { data: lockConfig } = useVotingEscrowConfigQuery();
  const { data: lockInfo } = useMyLockInfoQuery();

  return useMemo(
    () =>
      lockInfo &&
      lockConfig &&
      (((lockInfo.end - lockInfo.start) * lockConfig.periodDuration) as Second),
    [lockConfig, lockInfo],
  );
};
