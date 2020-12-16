import { useState } from 'react';

export default <T>(key: string, initial?: T) => {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch (error) {
      console.error(error);
      return initial;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const next = value instanceof Function ? value(stored) : value;
      setStored(next);
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch (error) {
      console.error(error);
    }
  };

  return [stored, setValue] as const;
};
