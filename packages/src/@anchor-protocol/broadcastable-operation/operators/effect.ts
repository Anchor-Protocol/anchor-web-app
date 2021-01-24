import { Operator, OperatorOption } from '../context/types';

export const effect = <T, R>(
  op: Operator<T, R>,
  fn: (params: T, option: OperatorOption) => void | Promise<void>,
): Operator<T, R> => {
  return async (params: T, option: OperatorOption) => {
    await fn(params, option);
    return op(params, option);
  };
};
