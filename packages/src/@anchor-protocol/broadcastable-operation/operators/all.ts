import { Operator, OperatorOption } from '../context/types';

export function all<T, R1, R2>(
  o1: Operator<T, R1>,
  o2: Operator<T, R2>,
): (params: T, option: OperatorOption) => Promise<[R1, R2]>;

export function all<T, R1, R2, R3>(
  o1: Operator<T, R1>,
  o2: Operator<T, R2>,
  o3: Operator<T, R3>,
): (params: T, option: OperatorOption) => Promise<[R1, R2, R3]>;

export function all<T, R1, R2, R3, R4>(
  o1: Operator<T, R1>,
  o2: Operator<T, R2>,
  o3: Operator<T, R3>,
  o4: Operator<T, R4>,
): (params: T, option: OperatorOption) => Promise<[R1, R2, R3, R4]>;

export function all<T, R1, R2, R3, R4, R5>(
  o1: Operator<T, R1>,
  o2: Operator<T, R2>,
  o3: Operator<T, R3>,
  o4: Operator<T, R4>,
  o5: Operator<T, R5>,
): (params: T, option: OperatorOption) => Promise<[R1, R2, R3, R4, R5]>;

export function all<T, R1, R2, R3, R4, R5, R6>(
  o1: Operator<T, R1>,
  o2: Operator<T, R2>,
  o3: Operator<T, R3>,
  o4: Operator<T, R4>,
  o5: Operator<T, R5>,
  o6: Operator<T, R6>,
): (params: T, option: OperatorOption) => Promise<[R1, R2, R3, R4, R5, R6]>;

export function all<T, R1, R2, R3, R4, R5, R6, R7>(
  o1: Operator<T, R1>,
  o2: Operator<T, R2>,
  o3: Operator<T, R3>,
  o4: Operator<T, R4>,
  o5: Operator<T, R5>,
  o6: Operator<T, R6>,
  o7: Operator<T, R7>,
): (params: T, option: OperatorOption) => Promise<[R1, R2, R3, R4, R5, R6, R7]>;

export function all<T, R1, R2, R3, R4, R5, R6, R7, R8>(
  o1: Operator<T, R1>,
  o2: Operator<T, R2>,
  o3: Operator<T, R3>,
  o4: Operator<T, R4>,
  o5: Operator<T, R5>,
  o6: Operator<T, R6>,
  o7: Operator<T, R7>,
  o8: Operator<T, R8>,
): (
  params: T,
  option: OperatorOption,
) => Promise<[R1, R2, R3, R4, R5, R6, R7, R8]>;

export function all(
  ...operators: Operator<any, any>[]
): (params: any, option: OperatorOption) => Promise<any> {
  return (params: any, option: OperatorOption) =>
    Promise.all(operators.map((o) => o(params, option)));
}
