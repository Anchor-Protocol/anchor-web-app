import { JSDateTime } from '@anchor-protocol/types';
import { differenceInDays, format, toDate } from 'date-fns';

export function shortDay(datetime: JSDateTime): string {
  return format(datetime, 'MMM d');
}

export function mediumDay(datetime: JSDateTime): string {
  return format(datetime, 'EEE, MMM d');
}

function checkTickPrint(i: number, length: number, timestamp: number): boolean {
  const date = toDate(timestamp).getDate();

  // always print
  // if the tick is first of ticks
  if (i === 0) {
    return true;
  }
  // print 1 or 15
  // if the tick is not near first or last
  else if (date === 1 || date === 15) {
    return i > 3 && i < length - 4;
  }

  return false;
}

export function xTimestampAxis(datetimes: JSDateTime[]): string[] {
  return datetimes.map((timestamp, i) => {
    return i === datetimes.length - 1
      ? 'Now'
      : checkTickPrint(i, datetimes.length, timestamp)
      ? format(timestamp, 'MMM d')
      : '';
  });
}

export const findPrevDay = (now: number) => {
  return ({ timestamp }: { timestamp: number }) => {
    return differenceInDays(now, timestamp) === 1;
  };
};
