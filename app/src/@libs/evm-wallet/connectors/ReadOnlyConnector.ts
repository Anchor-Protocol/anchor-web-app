import { Connector } from '@web3-react/types';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { SupportedChainRpcs } from '../constants';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';

export interface ReadOnlyConnectionConfig {
  chainId: EvmChainId;
  account: string;
}

export class ReadOnlyConnector extends Connector {
  public customProvider: StaticJsonRpcProvider | undefined;

  public async activate({ chainId, account }: ReadOnlyConnectionConfig) {
    this.customProvider = new StaticJsonRpcProvider(
      SupportedChainRpcs[chainId],
    );
    this.actions.update({ chainId, accounts: [account] });
  }
}
