import { useCallback, useState } from 'react';

export function useLocalStorage<T extends string>(
  key: string,
  defaultValue: () => T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(
    () => (localStorage.getItem(key) as T) ?? defaultValue(),
  );

  const updateValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        if (prev !== next) {
          localStorage.setItem(key, next);
          return next;
        }
        return prev;
      });
    },
    [key],
  );

  return [value, updateValue];
}

export function useLocalStorageJson<T extends {}>(
  key: string,
  defaultValue: () => T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const storedString = localStorage.getItem(key);
    try {
      return storedString ? JSON.parse(storedString) : defaultValue();
    } catch {
      return defaultValue();
    }
  });

  const updateValue = useCallback(
    (value: T) => {
      setValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key],
  );

  return [value, updateValue];
}
