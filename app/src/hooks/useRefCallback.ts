import { NominalType } from '@anchor-protocol/crossanchor-sdk';
import { DependencyList, useEffect, useMemo, useRef } from 'react';

export type RefCallback<T> = T & NominalType<'RefCallback'>;

export const useRefCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList,
): RefCallback<T> => {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return useMemo(
    () =>
      ((...args) => {
        const fn = ref.current;
        return fn(...args);
      }) as RefCallback<T>,
    [ref],
  );
};
