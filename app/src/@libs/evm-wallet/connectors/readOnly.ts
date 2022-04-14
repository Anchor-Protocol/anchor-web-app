import { initializeConnector } from '@web3-react/core';
import { SupportedChainIds } from '../constants';
import { ReadOnlyConnector } from './ReadOnlyConnector';

export const [readOnly, readOnlyHooks, readOnlyStore] =
  initializeConnector<ReadOnlyConnector>(
    (actions) => new ReadOnlyConnector(actions),
    SupportedChainIds,
  );
