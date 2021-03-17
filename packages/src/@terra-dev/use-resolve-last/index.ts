import { useCallback, useEffect, useMemo, useState } from 'react';

export class Resolver<T> {
  latestId: number = -1;
  subscriptions: Set<(value: T) => void> = new Set();

  subscribe = (subscription: (value: T) => void): (() => void) => {
    this.subscriptions.add(subscription);

    return () => {
      this.subscriptions.delete(subscription);
    };
  };

  next = (value: Promise<T> | T) => {
    const id = Math.random() * 1000000;
    this.latestId = id;

    Promise.resolve(value).then((resolvedValue) => {
      if (this.latestId === id) {
        for (const subscription of this.subscriptions) {
          subscription(resolvedValue);
        }
      }
    });
  };

  destroy = () => {
    this.subscriptions.clear();
  };
}

export function useResolveLast<T>(
  init: () => T,
): [resolve: (value: Promise<T> | T) => void, result: T] {
  const [state, setState] = useState<T>(init);

  const resolver = useMemo<Resolver<T>>(() => new Resolver<T>(), []);

  const resolve = useCallback(
    (value: Promise<T> | T) => {
      resolver.next(value);
    },
    [resolver],
  );

  useEffect(() => {
    resolver.subscribe(setState);

    return () => {
      resolver.destroy();
    };
  }, [resolver]);

  return [resolve, state];
}
