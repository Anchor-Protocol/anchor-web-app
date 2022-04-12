import { useEstimatedBlockTime } from './useEstimatedBlockTime';
import { useBlockQuery } from 'queries';

export const useEstimatedTimestamp = (
  blockHeight: number,
): number | undefined => {
  const blockTime = useEstimatedBlockTime();
  const { data: lastSyncedBlock } = useBlockQuery('latest');

  if (blockTime === undefined || lastSyncedBlock === undefined) {
    return;
  }

  return (
    lastSyncedBlock.timestamp +
    (blockHeight - lastSyncedBlock.height) * blockTime
  );
};
