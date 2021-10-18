import { JSDateTime } from '@libs/types';
import { format } from 'date-fns';

export function dedupeTimestamp<Item extends {}>(
  data: Item[],
  timestampKey: keyof Item,
): Item[] {
  const dedupedData: Item[] = [];
  const indicies: Map<string, number> = new Map();

  for (const item of data) {
    //@ts-ignore
    const timestamp: JSDateTime = item[timestampKey];

    if (!timestamp) {
      continue;
    }

    const dateString = format(timestamp, 'yyyyMMdd');
    if (indicies.has(dateString)) {
      dedupedData[indicies.get(dateString)!] = item;
    } else {
      const nextIndex = dedupedData.push(item) - 1;
      indicies.set(dateString, nextIndex);
    }
  }

  return dedupedData;
}
