import { useInterval } from '@terra-dev/use-interval';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useOperationBroadcaster } from './OperationBroadcaster';
import { Broadcasting } from './types';

export interface BroadcastingOption<T> {
  filter?: (broadcasting: Broadcasting) => boolean;
  map?: (broadcasting: Broadcasting) => T;
  displayTime?: number;
}

export function createBroadcastingOption<T = Broadcasting>(
  options: BroadcastingOption<T>,
): BroadcastingOption<T> {
  return options;
}

export function useBroadcasting<T = Broadcasting>({
  filter,
  map,
  displayTime = 0,
}: BroadcastingOption<T> = {}): T[] {
  const { broadcasting, stopBroadcast } = useOperationBroadcaster();

  const broadcastingRef = useRef(broadcasting);

  useEffect(() => {
    broadcastingRef.current = broadcasting;
  }, [broadcasting]);

  const tick = useCallback(() => {
    if (broadcastingRef.current.length === 0) {
      return;
    }

    const now = Date.now();

    const stop = broadcastingRef.current.filter(
      ({ result: { status }, from }) =>
        (status === 'done' || status === 'fault') && displayTime + from < now,
    );

    if (stop.length > 0) {
      stopBroadcast(...stop.map(({ id }) => id));
    }
  }, [displayTime, stopBroadcast]);

  useInterval(tick, broadcasting.length > 0 ? displayTime : 0);

  const renderings = useMemo<T[]>(() => {
    const filtered = filter ? broadcasting.filter(filter) : broadcasting;
    return (map ? filtered.map<T>(map) : filtered) as T[];
  }, [broadcasting, filter, map]);

  return renderings;
}
