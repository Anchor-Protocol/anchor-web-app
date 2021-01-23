import { useMemo } from 'react';
import { useOperationBroadcaster } from './OperationBroadcaster';
import { Broadcasting } from './types';

export interface BroadcastingOption<T> {
  filter?: (broadcasting: Broadcasting) => boolean;
  displayTime?: number | ((broadcasting: Broadcasting) => number);
  map?: (broadcasting: Broadcasting) => T;
}

export function createBroadcastingOption<T = Broadcasting>(
  options: BroadcastingOption<T>,
): BroadcastingOption<T> {
  return options;
}

export function useBroadcasting<T = Broadcasting>({
  filter,
  map,
  displayTime,
}: BroadcastingOption<T> = {}): T[] {
  const { broadcasting } = useOperationBroadcaster();

  return useMemo<T[]>(() => {
    const filtered = filter ? broadcasting.filter(filter) : broadcasting;
    return (map ? filtered.map<T>(map) : filtered) as T[];
  }, [broadcasting, filter, map]);
}
