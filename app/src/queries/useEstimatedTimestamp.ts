import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { useLastSyncedBlock } from './useLastSyncedBlock';
import { millisecondsInHour, getDaysInYear } from 'date-fns';

const hoursInDay = 24;

export const useEstimatedTimestamp = (
  blockHeight: number,
): number | undefined => {
  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  const { data: lastSyncedBlock } = useLastSyncedBlock();
  if (lastSyncedBlock === undefined) {
    return;
  }

  const daysInYear = getDaysInYear(new Date());
  const millisecondsInYear = daysInYear * millisecondsInHour * hoursInDay;

  return (
    lastSyncedBlock.timestamp +
    (blockHeight - lastSyncedBlock.height) *
      (millisecondsInYear / blocksPerYear)
  );
};
