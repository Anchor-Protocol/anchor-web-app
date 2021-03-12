import { Operator } from '../context/types';

export function gate<O extends Operator<any, any>>(
  operator: O,
  enter?: (params: O extends Operator<infer P, any> ? P : never) => void,
  exit?: (value: O extends Operator<any, infer R> ? R : never) => void,
): O {
  return (async (params: any) => {
    enter && enter(params);
    const value = await operator(params);
    exit && exit(value);
    return value;
  }) as any;
}
