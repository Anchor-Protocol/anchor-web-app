import { Operator } from '../context/types';

export function merge<
  T1 extends {},
  R1 extends {},
  T2 extends {},
  R2 extends {}
>(
  o1: Operator<T1, R1>,
  o2: Operator<T2, R2>,
): (params: T1 & T2) => Promise<R1 & R2>;

export function merge<
  T1 extends {},
  R1 extends {},
  T2 extends {},
  R2 extends {},
  T3 extends {},
  R3 extends {}
>(
  o1: Operator<T1, R1>,
  o2: Operator<T2, R2>,
  o3: Operator<T3, R3>,
): (params: T1 & T2 & T3) => Promise<R1 & R2 & R3>;

export function merge<
  T1 extends {},
  R1 extends {},
  T2 extends {},
  R2 extends {},
  T3 extends {},
  R3 extends {},
  T4 extends {},
  R4 extends {}
>(
  o1: Operator<T1, R1>,
  o2: Operator<T2, R2>,
  o3: Operator<T3, R3>,
  o4: Operator<T4, R4>,
): (params: T1 & T2 & T3 & T4) => Promise<R1 & R2 & R3 & R4>;

export function merge<
  T1 extends {},
  R1 extends {},
  T2 extends {},
  R2 extends {},
  T3 extends {},
  R3 extends {},
  T4 extends {},
  R4 extends {},
  T5 extends {},
  R5 extends {}
>(
  o1: Operator<T1, R1>,
  o2: Operator<T2, R2>,
  o3: Operator<T3, R3>,
  o4: Operator<T4, R4>,
  o5: Operator<T5, R5>,
): (params: T1 & T2 & T3 & T4 & T5) => Promise<R1 & R2 & R3 & R4 & R5>;

export function merge<
  T1 extends {},
  R1 extends {},
  T2 extends {},
  R2 extends {},
  T3 extends {},
  R3 extends {},
  T4 extends {},
  R4 extends {},
  T5 extends {},
  R5 extends {},
  T6 extends {},
  R6 extends {}
>(
  o1: Operator<T1, R1>,
  o2: Operator<T2, R2>,
  o3: Operator<T3, R3>,
  o4: Operator<T4, R4>,
  o5: Operator<T5, R5>,
  o6: Operator<T6, R6>,
): (
  params: T1 & T2 & T3 & T4 & T5 & T6,
) => Promise<R1 & R2 & R3 & R4 & R5 & R6>;

export function merge<
  T1 extends {},
  R1 extends {},
  T2 extends {},
  R2 extends {},
  T3 extends {},
  R3 extends {},
  T4 extends {},
  R4 extends {},
  T5 extends {},
  R5 extends {},
  T6 extends {},
  R6 extends {},
  T7 extends {},
  R7 extends {}
>(
  o1: Operator<T1, R1>,
  o2: Operator<T2, R2>,
  o3: Operator<T3, R3>,
  o4: Operator<T4, R4>,
  o5: Operator<T5, R5>,
  o6: Operator<T6, R6>,
  o7: Operator<T7, R7>,
): (
  params: T1 & T2 & T3 & T4 & T5 & T6 & T7,
) => Promise<R1 & R2 & R3 & R4 & R5 & R6 & R7>;

export function merge<
  T1 extends {},
  R1 extends {},
  T2 extends {},
  R2 extends {},
  T3 extends {},
  R3 extends {},
  T4 extends {},
  R4 extends {},
  T5 extends {},
  R5 extends {},
  T6 extends {},
  R6 extends {},
  T7 extends {},
  R7 extends {},
  T8 extends {},
  R8 extends {}
>(
  o1: Operator<T1, R1>,
  o2: Operator<T2, R2>,
  o3: Operator<T3, R3>,
  o4: Operator<T4, R4>,
  o5: Operator<T5, R5>,
  o6: Operator<T6, R6>,
  o7: Operator<T7, R7>,
  o8: Operator<T8, R8>,
): (
  params: T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8,
) => Promise<R1 & R2 & R3 & R4 & R5 & R6 & R7 & R8>;

export function merge<
  T1 extends {},
  R1 extends {},
  T2 extends {},
  R2 extends {},
  T3 extends {},
  R3 extends {},
  T4 extends {},
  R4 extends {},
  T5 extends {},
  R5 extends {},
  T6 extends {},
  R6 extends {},
  T7 extends {},
  R7 extends {},
  T8 extends {},
  R8 extends {}
>(
  o1: Operator<T1, R1>,
  o2: Operator<T2, R2>,
  o3: Operator<T3, R3>,
  o4: Operator<T4, R4>,
  o5: Operator<T5, R5>,
  o6: Operator<T6, R6>,
  o7: Operator<T7, R7>,
  o8: Operator<T8, R8>,
): (
  params: T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8,
) => Promise<R1 & R2 & R3 & R4 & R5 & R6 & R7 & R8>;

export function merge(
  ...operators: Operator<any, any>[]
): (params: any) => Promise<any> {
  return (params: any) =>
    Promise.all(operators.map((o) => o(params))).then((results) => {
      return results.reduce((r, v) => ({ ...r, ...v }), {});
    });
}
