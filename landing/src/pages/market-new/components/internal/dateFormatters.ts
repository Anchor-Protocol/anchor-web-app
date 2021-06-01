import { JSDateTime } from '@anchor-protocol/types';
import { format, isFirstDayOfMonth, toDate } from 'date-fns';

export function shortDay(datetime: JSDateTime): string {
  return format(datetime, 'MMM d');
}

export function mediumDay(datetime: JSDateTime): string {
  return format(datetime, 'EEE, MMM d');
}

export function xTimestampAixs(datetimes: JSDateTime[]): string[] {
  return datetimes.map((timestamp, i) => {
    return i === 0 ||
      isFirstDayOfMonth(timestamp) ||
      toDate(timestamp).getDate() === 15
      ? format(timestamp, 'MMM d')
      : '';
  });
}
