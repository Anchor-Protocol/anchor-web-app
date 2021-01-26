import { useEffect, useRef, useState } from 'react';

export function useMap<T, R>(state: T, map: (next: T, prev: R) => R): R {
  const savedMap = useRef(map);

  useEffect(() => {
    savedMap.current = map;
  }, [map]);

  const [value, set] = useState<R>(() => map(state, undefined as any));

  useEffect(() => {
    set((prev) => savedMap.current(state, prev));
  }, [state]);

  return value;
}
