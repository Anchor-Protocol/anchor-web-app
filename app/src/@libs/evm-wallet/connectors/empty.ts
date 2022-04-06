import { initializeConnector } from '@web3-react/core';
import { Empty } from '@web3-react/empty';

export const [empty, hooks] = initializeConnector<Empty>(
  (actions) => new Empty(actions),
);
