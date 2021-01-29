import {
  Operator,
  OperatorOption,
} from '@anchor-protocol/broadcastable-operation';
import { uLuna } from '@anchor-protocol/notation';

export const takeSwapFee = <O extends Operator<any, any>>(
  storage: Map<string, any>,
  operator: O,
): O extends Operator<infer T, infer R>
  ? Operator<T & { swapFee: uLuna }, R>
  : never => {
  return ((param: { swapFee: uLuna }, option: OperatorOption) => {
    storage.set('swapFee', param.swapFee);
    return operator(param, option);
  }) as any;
};

export function injectSwapFee<O extends Operator<any, any>>(
  storage: Map<string, any>,
  operator: O,
): O extends Operator<infer T, infer R>
  ? Operator<T, R & { swapFee: uLuna }>
  : never {
  return (async (param: any, option: OperatorOption) => {
    const swapFee = storage.get('swapFee');
    const value = await operator(param, option);
    return { ...value, swapFee };
  }) as any;
}
