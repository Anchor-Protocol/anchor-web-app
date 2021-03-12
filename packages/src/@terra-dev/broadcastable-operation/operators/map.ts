import { Operator } from '../context/types';

export function map<O extends Operator<any, any>, MR>(
  operator: O,
  mapFunction: (value: O extends Operator<any, infer R> ? R : never) => MR,
): O extends Operator<infer T, any> ? Operator<T, MR> : never {
  return (async (param: any) => {
    const value = await operator(param);
    return mapFunction(value);
  }) as O extends Operator<infer T, any> ? Operator<T, MR> : never;
}
