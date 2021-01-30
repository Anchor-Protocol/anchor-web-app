import { Operator } from '../context/types';

export const effect = <T>(
  fn: (params: T) => void | Promise<void>,
): Operator<T, T> => {
  return async (value: T) => {
    await fn(value);
    return value;
  };
};
