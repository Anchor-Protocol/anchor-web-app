import { useInterval } from '@libs/use-interval';
import { createElement, Fragment, useCallback, useState } from 'react';

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export const timeGap = (endTime: Date, now: Date) => {
  const gap = endTime.getTime() - now.getTime();

  if (gap < 0) return '00:00:00';

  if (gap > HOUR * 99) return Math.floor(gap / DAY) + ' Days';

  const hours = Math.floor(gap / HOUR);
  const minutes = Math.floor((gap - hours * HOUR) / MINUTE);
  const seconds = Math.floor((gap - hours * HOUR - minutes * MINUTE) / SECOND);

  return (
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0')
  );
};

export function useTimeEnd(endTime: Date): string {
  const [remainTime, setRemainTime] = useState<string>(() =>
    timeGap(endTime, new Date()),
  );

  const updateRemainTime = useCallback(() => {
    setRemainTime(timeGap(endTime, new Date()));
  }, [endTime]);

  useInterval(updateRemainTime, Date.now() < endTime.getTime() ? 1000 : 0);

  return remainTime;
}

export function TimeEnd({ endTime }: { endTime: Date }) {
  const remainTime = useTimeEnd(endTime);
  return createElement(Fragment, { children: remainTime });
}
