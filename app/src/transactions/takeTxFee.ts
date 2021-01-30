import { Operator } from '@anchor-protocol/broadcastable-operation';
import { uUST } from '@anchor-protocol/notation';

export const takeTxFee = <O extends Operator<any, any>>(
  storage: Map<string, any>,
  operator: O,
): O extends Operator<infer T, infer R>
  ? Operator<T & { txFee: uUST }, R>
  : never => {
  return ((param: { txFee: uUST }) => {
    storage.set('txFee', param.txFee);
    return operator(param);
  }) as any;
};

export function injectTxFee<O extends Operator<any, any>>(
  storage: Map<string, any>,
  operator: O,
): O extends Operator<infer T, infer R>
  ? Operator<T, R & { txFee: uUST }>
  : never {
  return (async (param: any) => {
    const txFee = storage.get('txFee');
    const value = await operator(param);
    return { ...value, txFee };
  }) as any;
}
