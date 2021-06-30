import { QueryFunctionContext } from 'react-query';

export function createQueryFn<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
): (ctx: QueryFunctionContext<[string, ...T]>) => Promise<R> {
  return ({ queryKey: [, ...args] }) => {
    return fn(...(args as T));
  };
}
