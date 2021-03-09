import { Operator } from '@anchor-protocol/broadcastable-operation';
import type { uUST } from '@anchor-protocol/types';

export const takeTxFee = (
  storage: Map<string, any>,
): Operator<{ txFee: uUST }, {}> => (param: { txFee: uUST }) => {
  storage.set('txFee', param.txFee);
  return {};
};

export const injectTxFee = (
  storage: Map<string, any>,
): Operator<{}, { txFee: uUST }> => () => {
  return { txFee: storage.get('txFee') as uUST };
};
