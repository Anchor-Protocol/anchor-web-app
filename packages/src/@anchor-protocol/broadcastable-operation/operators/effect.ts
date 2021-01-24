import { Operator, OperatorOption } from '../context/types';

export const effect = <T>(
  fn: (params: T, option: OperatorOption) => void | Promise<void>,
): Operator<T, T> => {
  return async (value: T, option: OperatorOption) => {
    await fn(value, option);
    return value;
  };
};
