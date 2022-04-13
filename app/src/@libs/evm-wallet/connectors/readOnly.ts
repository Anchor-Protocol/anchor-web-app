import { initializeConnector } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { SupportedChainIds, SupportedChainRpcs } from '../constants';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';

export class ReadOnly extends Connector {
  public customProvider: StaticJsonRpcProvider | undefined;

  public async activate(chainId: EvmChainId, account: string) {
    this.customProvider = new StaticJsonRpcProvider(
      SupportedChainRpcs[chainId],
    );
    this.actions.update({ chainId, accounts: [account] });
  }
}

export const [readOnly, readOnlyHooks, readOnlyStore] =
  initializeConnector<ReadOnly>(
    (actions) => new ReadOnly(actions),
    SupportedChainIds,
  );
