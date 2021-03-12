import { OperationOptions, Operator } from './types';

export function createOperationOptions<T1, R, D>(
  params: OperationOptions<R, D, [Operator<T1, R>], [T1, R]>,
): typeof params;

export function createOperationOptions<T1, T2, R, D>(
  params: OperationOptions<
    R,
    D,
    [Operator<T1, T2>, Operator<T2, R>],
    [T1, T2, R]
  >,
): typeof params;

export function createOperationOptions<T1, T2, T3, R, D>(
  params: OperationOptions<
    R,
    D,
    [Operator<T1, T2>, Operator<T2, T3>, Operator<T3, R>],
    [T1, T2, T3, R]
  >,
): typeof params;

export function createOperationOptions<T1, T2, T3, T4, R, D>(
  params: OperationOptions<
    R,
    D,
    [Operator<T1, T2>, Operator<T2, T3>, Operator<T3, T4>, Operator<T4, R>],
    [T1, T2, T3, T4, R]
  >,
): typeof params;

export function createOperationOptions<T1, T2, T3, T4, T5, R, D>(
  params: OperationOptions<
    R,
    D,
    [
      Operator<T1, T2>,
      Operator<T2, T3>,
      Operator<T3, T4>,
      Operator<T4, T5>,
      Operator<T5, R>,
    ],
    [T1, T2, T3, T4, T5, R]
  >,
): typeof params;

export function createOperationOptions<T1, T2, T3, T4, T5, T6, R, D>(
  params: OperationOptions<
    R,
    D,
    [
      Operator<T1, T2>,
      Operator<T2, T3>,
      Operator<T3, T4>,
      Operator<T4, T5>,
      Operator<T5, T6>,
      Operator<T6, R>,
    ],
    [T1, T2, T3, T4, T5, T6, R]
  >,
): typeof params;

export function createOperationOptions<T1, T2, T3, T4, T5, T6, T7, R, D>(
  params: OperationOptions<
    R,
    D,
    [
      Operator<T1, T2>,
      Operator<T2, T3>,
      Operator<T3, T4>,
      Operator<T4, T5>,
      Operator<T5, T6>,
      Operator<T6, T7>,
      Operator<T7, R>,
    ],
    [T1, T2, T3, T4, T5, T6, T7, R]
  >,
): typeof params;

export function createOperationOptions<T1, T2, T3, T4, T5, T6, T7, T8, R, D>(
  params: OperationOptions<
    R,
    D,
    [
      Operator<T1, T2>,
      Operator<T2, T3>,
      Operator<T3, T4>,
      Operator<T4, T5>,
      Operator<T5, T6>,
      Operator<T6, T7>,
      Operator<T7, T8>,
      Operator<T8, R>,
    ],
    [T1, T2, T3, T4, T5, T6, T7, T8, R]
  >,
): typeof params;

export function createOperationOptions<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  R,
  D
>(
  params: OperationOptions<
    R,
    D,
    [
      Operator<T1, T2>,
      Operator<T2, T3>,
      Operator<T3, T4>,
      Operator<T4, T5>,
      Operator<T5, T6>,
      Operator<T6, T7>,
      Operator<T7, T8>,
      Operator<T8, T9>,
      Operator<T9, R>,
    ],
    [T1, T2, T3, T4, T5, T6, T7, T8, T9, R]
  >,
): typeof params;

export function createOperationOptions(
  params: OperationOptions<any, any, any, any>,
): OperationOptions<any, any, any, any> {
  return params;
}
