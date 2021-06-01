import { JSDateTime } from '@anchor-protocol/types';
import { format, isFirstDayOfMonth, toDate } from 'date-fns';

export function shortDay(datetime: JSDateTime): string {
  return format(datetime, 'MMM d');
}

export function mediumDay(datetime: JSDateTime): string {
  return format(datetime, 'EEE, MMM d');
}

function isFirstItemAndNotNear1or15(i: number, timestamp: number): boolean {
  if (i !== 0) {
    return false;
  }

  const date = toDate(timestamp).getDate();
  return date < 27 && date > 3;
}

export function xTimestampAixs(datetimes: JSDateTime[]): string[] {
  return datetimes.map((timestamp, i) => {
    return isFirstItemAndNotNear1or15(i, timestamp) ||
      isFirstDayOfMonth(timestamp) ||
      toDate(timestamp).getDate() === 15
      ? format(timestamp, 'MMM d')
      : '';
  });
}
