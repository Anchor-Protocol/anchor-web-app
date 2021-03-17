import { Operator } from '../context/types';
import { OperationTimeoutError } from '../errors';

const Timeout = '__operation_timeout__' as const;

export function timeout<O extends Operator<any, any>>(
  operator: O,
  timeout: number,
): O {
  return (async (param: any) => {
    const value = await Promise.race([
      operator(param),
      new Promise((resolve) =>
        setTimeout(() => {
          resolve(Timeout);
        }, timeout),
      ),
    ]);

    if (value === Timeout) {
      throw new OperationTimeoutError();
    }

    return value as any;
  }) as O;
}
