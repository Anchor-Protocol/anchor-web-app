import equal from 'fast-deep-equal';
import { DependencyList, useMemo, useRef } from 'react';

function useDeepCompareMemoize(value: DependencyList) {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (!equal(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return [signalRef.current];
}

export function useDeepMemo<T>(callback: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo<T>(callback, useDeepCompareMemoize(deps));
}
