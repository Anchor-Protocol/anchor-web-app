import { Second, MillisTimestamp } from '@libs/types';

export const computeEstimatedLockPeriodEndAt = (
  period: Second,
  currentLockPeriodEndsAt: MillisTimestamp,
) => {
  return (Math.max(currentLockPeriodEndsAt, Date.now()) +
    period * 1000) as MillisTimestamp;
};
