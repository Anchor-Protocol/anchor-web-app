import { OperationTimeoutError } from './errors';
import { Operator } from './types';

const Timeout = Symbol('TIMEOUT');

export function withTimeout<O extends Operator<any, any>>(
  operator: O,
  timeout: number,
): O {
  return ((param: any) => {
    Promise.race([
      operator(param),
      new Promise((resolve) =>
        setTimeout(() => {
          resolve(Timeout);
        }, timeout),
      ),
    ]).then((value: any) => {
      if (value === Timeout) {
        throw new OperationTimeoutError();
      }
      return value as any;
    });
  }) as O;
}
