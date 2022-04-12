import { initializeConnector } from '@web3-react/core';
import { Connector } from '@web3-react/types';

export class ReadOnly extends Connector {
  public async activate() {}
}

export const [readOnly, readOnlyHooks, readOnlyStore] =
  initializeConnector<ReadOnly>((actions) => new ReadOnly(actions));
