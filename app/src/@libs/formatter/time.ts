import { MillisTimestamp } from '@libs/types';
import format from 'date-fns/format';

export const formatEllapsed = (ms: number): string => {
  return new Date(ms).toISOString().substr(11, 8);
};

export const formatEllapsedSimple = (ms: number): string => {
  return new Date(ms).toISOString().substr(14, 5);
};

export const formatTimestamp = (
  timestamp: MillisTimestamp,
  includeTimeZone: boolean = true,
) => {
  const date = new Date(timestamp);

  const text = `${date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} ${date.toLocaleTimeString('en-US')}`;

  return includeTimeZone ? `${text} ${format(date, 'z')}` : text;
};

export const getCurrentTimeZone = () => {
  return format(new Date(), 'z');
};
