import {
  Operator,
  OperatorOption,
} from '@anchor-protocol/broadcastable-operation';
import { uUST } from '@anchor-protocol/notation';

export const takeTxFee = <O extends Operator<any, any>>(
  storage: Map<string, any>,
  operator: O,
): O extends Operator<infer T, infer R>
  ? Operator<T & { txFee: uUST }, R>
  : never => {
  return ((param: { txFee: uUST }, option: OperatorOption) => {
    storage.set('txFee', param.txFee);
    return operator(param, option);
  }) as any;
};

export function injectTxFee<O extends Operator<any, any>>(
  storage: Map<string, any>,
  operator: O,
): O extends Operator<infer T, infer R>
  ? Operator<T, R & { txFee: uUST }>
  : never {
  return (async (param: any, option: OperatorOption) => {
    const txFee = storage.get('txFee');
    const value = await operator(param, option);
    return { ...value, txFee };
  }) as any;
}
