export type Operator<T, R> = (param: T) => R | Promise<R>;

export function asyncPipe<T1, R>(
  o1: Operator<T1, R>,
): (param: T1) => Promise<R>;

export function asyncPipe<T1, T2, R>(
  o1: Operator<T1, T2>,
  o2: Operator<T2, R>,
): (param: T1) => Promise<R>;

export function asyncPipe<T1, T2, T3, R>(
  o1: Operator<T1, T2>,
  o2: Operator<T2, T3>,
  o3: Operator<T3, R>,
): (param: T1) => Promise<R>;

export function asyncPipe<T1, T2, T3, T4, R>(
  o1: Operator<T1, T2>,
  o2: Operator<T2, T3>,
  o3: Operator<T3, T4>,
  o4: Operator<T4, R>,
): (param: T1) => Promise<R>;

export function asyncPipe<T1, T2, T3, T4, T5, R>(
  o1: Operator<T1, T2>,
  o2: Operator<T2, T3>,
  o3: Operator<T3, T4>,
  o4: Operator<T4, T5>,
  o5: Operator<T5, R>,
): (param: T1) => Promise<R>;

export function asyncPipe<T1, T2, T3, T4, T5, T6, R>(
  o1: Operator<T1, T2>,
  o2: Operator<T2, T3>,
  o3: Operator<T3, T4>,
  o4: Operator<T4, T5>,
  o5: Operator<T5, T6>,
  o6: Operator<T6, R>,
): (param: T1) => Promise<R>;

export function asyncPipe<T1, T2, T3, T4, T5, T6, T7, R>(
  o1: Operator<T1, T2>,
  o2: Operator<T2, T3>,
  o3: Operator<T3, T4>,
  o4: Operator<T4, T5>,
  o5: Operator<T5, T6>,
  o6: Operator<T6, T7>,
  o7: Operator<T7, R>,
): (param: T1) => Promise<R>;

export function asyncPipe<T1, T2, T3, T4, T5, T6, T7, T8, R>(
  o1: Operator<T1, T2>,
  o2: Operator<T2, T3>,
  o3: Operator<T3, T4>,
  o4: Operator<T4, T5>,
  o5: Operator<T5, T6>,
  o6: Operator<T6, T7>,
  o7: Operator<T7, T8>,
  o8: Operator<T8, R>,
): (param: T1) => Promise<R>;

export function asyncPipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(
  o1: Operator<T1, T2>,
  o2: Operator<T2, T3>,
  o3: Operator<T3, T4>,
  o4: Operator<T4, T5>,
  o5: Operator<T5, T6>,
  o6: Operator<T6, T7>,
  o7: Operator<T7, T8>,
  o8: Operator<T8, T9>,
  o9: Operator<T9, R>,
): (param: T1) => Promise<R>;

export function asyncPipe(
  ...fns: Operator<any, any>[]
): (param: any) => Promise<any> {
  if (fns.length > 1) {
    return async (param) => {
      let value = param;

      let i: number = -1;
      const max: number = fns.length;
      while (++i < max) {
        value = await fns[i](value);
      }

      return value;
    };
  } else {
    return fns[0];
  }
}
