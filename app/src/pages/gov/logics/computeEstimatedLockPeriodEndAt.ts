import { Second, MillisTimestamp } from '@libs/types';

export const computeEstimatedLockPeriodEndAt = (
  period: Second,
  currentLockPeriodEndsAt: MillisTimestamp,
) => {
  const now = new Date().getTime();

  return (Math.max(currentLockPeriodEndsAt, now) +
    period * 1000) as MillisTimestamp;
};
