import { addHours, startOfDay, subMinutes } from 'date-fns';

export function gmt9am(timestamp: number) {
  return addHours(
    subMinutes(startOfDay(timestamp), new Date().getTimezoneOffset()),
    9,
  ).getTime();
}
