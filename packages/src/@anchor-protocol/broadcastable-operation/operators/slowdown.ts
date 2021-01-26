import { Operator, OperatorOption } from '../context/types';

export function slowdown<O extends Operator<any, any>>(
  operator: O,
  ms: number,
): O {
  return (async (param: any, option: OperatorOption) => {
    const [value] = await Promise.all([
      operator(param, option),
      new Promise((resolve) => setTimeout(resolve, ms)),
    ]);

    return value;
  }) as O;
}
