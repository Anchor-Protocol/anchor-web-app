import { JSDateTime } from '@anchor-protocol/types';
import { format } from 'date-fns';

export function shortDay(datetime: JSDateTime): string {
  return format(datetime, 'MMM d');
}

export function mediumDay(datetime: JSDateTime): string {
  return format(datetime, 'EEE, MMM d');
}
