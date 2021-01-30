import { Operator } from '@anchor-protocol/broadcastable-operation';
import { uLuna } from '@anchor-protocol/notation';

export const takeSwapFee = (
  storage: Map<string, any>,
): Operator<{ swapFee: uLuna }, {}> => (param: { swapFee: uLuna }) => {
  storage.set('swapFee', param.swapFee);
  return {};
};

export const injectSwapFee = (
  storage: Map<string, any>,
): Operator<{}, { swapFee: uLuna }> => () => {
  return { swapFee: storage.get('swapFee') as uLuna };
};
