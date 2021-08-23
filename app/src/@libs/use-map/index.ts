import { useEffect, useMemo, useRef } from 'react';

export const shallowEqual =
  (keys: string[]) =>
  (prev: Record<string, any>, next: Record<string, any>): boolean => {
    for (const k of keys) {
      if (prev[k] !== next[k]) {
        return false;
      }
    }

    return true;
  };

type FieldsValues<R extends {}> = {
  [K in keyof R]: R[K] | undefined;
};

export type Mapped<T extends {}, R extends {}> = FieldsValues<R> & {
  __data: T | undefined;
};

export type Map<T, R> = {
  [K in keyof R]: (existing: Mapped<T, R>, incoming: T) => R[K] | undefined;
};

export function createMap<T extends {}, R extends {}>(
  map: Map<T, R>,
): Map<T, R> {
  return map;
}

export function useMap<T extends {}, R extends {}>(
  data: T | null | undefined,
  map: Map<T, R>,
  { ignoreNullData = true }: { ignoreNullData?: boolean } = {},
): Mapped<T, R> {
  const savedMap = useRef(map);

  useEffect(() => {
    savedMap.current = map;
  }, [map]);

  const existing = useRef<Mapped<T, R> | undefined>(undefined);

  return useMemo<Mapped<T, R>>(() => {
    const prev = existing.current;

    if (!!prev && !data && ignoreNullData) {
      return prev;
    }

    const keys = Object.keys(savedMap.current) as (keyof R)[];

    const values: FieldsValues<R> = keys.reduce((next, key) => {
      next[key] = data
        ? savedMap.current[key](prev ?? ({} as Mapped<T, R>), data)
        : ignoreNullData && prev && prev[key]
        ? (prev[key] as any)
        : undefined;
      return next;
    }, {} as FieldsValues<R>);

    if (prev && shallowEqual(keys as string[])(prev, values)) {
      return prev;
    }

    const next = {
      ...values,
      __data: data,
    } as Mapped<T, R>;

    existing.current = next;

    return next;
  }, [data, ignoreNullData]);
}

export function map<T extends {}, R extends {}>(
  data: T,
  map: Map<T, R>,
): Mapped<T, R> {
  const keys = Object.keys(map) as (keyof R)[];

  const values: FieldsValues<R> = keys.reduce((next, key) => {
    next[key] = map[key]({} as Mapped<T, R>, data);
    return next;
  }, {} as FieldsValues<R>);

  return {
    ...values,
    __data: data,
  };
}
