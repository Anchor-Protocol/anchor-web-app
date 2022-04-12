import { initializeConnector } from '@web3-react/core';
import { Actions } from '@web3-react/types';
import { Connector } from '@web3-react/types';
import { JsonRpcProvider } from '@ethersproject/providers';
import { SupportedChainIds, SupportedChainRpcs } from '../constants';

const jsonRpcProvider = new JsonRpcProvider();

type UrlMap = Record<number, string>;

export class ReadOnly extends Connector {
  public customProvider: JsonRpcProvider;

  constructor(actions: Actions, urlMap: UrlMap) {
    super(actions);

    // this.urlMap = urlMap;
    this.customProvider = jsonRpcProvider;
  }

  public async activate(account: string) {
    this.actions.update({ accounts: [account] });
  }
}

export const [readOnly, readOnlyHooks, readOnlyStore] =
  initializeConnector<ReadOnly>(
    (actions) => new ReadOnly(actions, SupportedChainRpcs),
    SupportedChainIds,
  );
