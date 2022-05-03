import { MillisTimestamp, Second } from '@libs/types';
import { millisecondsInSecond } from 'date-fns';

export const getLockPeriod = (
  timestamp: MillisTimestamp,
  periodDuration: Second,
) => Math.round(timestamp / millisecondsInSecond / periodDuration) as Second;
