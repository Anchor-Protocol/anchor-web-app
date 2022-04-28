import { MillisTimestamp } from '@libs/types';
import format from 'date-fns/format';

export const formatEllapsed = (ms: number): string => {
  return new Date(ms).toISOString().substr(11, 8);
};

export const formatEllapsedSimple = (ms: number): string => {
  return new Date(ms).toISOString().substr(14, 5);
};

export const formatTimestamp = (timestamp: MillisTimestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })} ${date.toLocaleTimeString('en-US')} ${format(date, 'z')}`;
};
