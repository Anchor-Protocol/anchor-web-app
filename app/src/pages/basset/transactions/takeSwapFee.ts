import { Operator } from '@anchor-protocol/broadcastable-operation';
import { uLuna } from '@anchor-protocol/notation';

export const takeSwapFee = <O extends Operator<any, any>>(
  storage: Map<string, any>,
  operator: O,
): O extends Operator<infer T, infer R>
  ? Operator<T & { swapFee: uLuna }, R>
  : never => {
  return ((param: { swapFee: uLuna }) => {
    storage.set('swapFee', param.swapFee);
    return operator(param);
  }) as any;
};

export function injectSwapFee<O extends Operator<any, any>>(
  storage: Map<string, any>,
  operator: O,
): O extends Operator<infer T, infer R>
  ? Operator<T, R & { swapFee: uLuna }>
  : never {
  return (async (param: any) => {
    const swapFee = storage.get('swapFee');
    const value = await operator(param);
    return { ...value, swapFee };
  }) as any;
}
