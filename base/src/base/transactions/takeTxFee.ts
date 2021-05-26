import { Operator } from '@terra-dev/broadcastable-operation';
import type { uUST } from '@anchor-protocol/types';

// TODO remove after refactoring done
export const takeTxFee = (
  storage: Map<string, any>,
): Operator<{ txFee: uUST }, {}> => (param: { txFee: uUST }) => {
  storage.set('txFee', param.txFee);
  return {};
};

// TODO remove after refactoring done
export const injectTxFee = (
  storage: Map<string, any>,
): Operator<{}, { txFee: uUST }> => () => {
  return { txFee: storage.get('txFee') as uUST };
};
