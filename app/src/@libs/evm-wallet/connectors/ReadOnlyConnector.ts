import { Connector, Actions } from '@web3-react/types';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { SupportedChainRpcs } from '../constants';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';

export interface ReadOnlyConnectionConfig {
  chainId: EvmChainId;
  account: string;
}

const localStorageConfigKey = '__anchor_evm_readonly_connection_config';

export class ReadOnlyConnector extends Connector {
  public customProvider: StaticJsonRpcProvider | undefined;

  constructor(actions: Actions, connectEagerly = false) {
    super(actions);

    if (connectEagerly) {
      this.connectEagerly();
    }
  }

  public async activate(config: ReadOnlyConnectionConfig) {
    const { chainId, account } = config;

    this.customProvider = new StaticJsonRpcProvider(
      SupportedChainRpcs[chainId],
    );
    this.actions.update({ chainId, accounts: [account] });

    window.localStorage.setItem(localStorageConfigKey, JSON.stringify(config));
  }

  public async deactivate() {
    window.localStorage.removeItem(localStorageConfigKey);
  }

  public async connectEagerly(): Promise<void> {
    const cancelActivation = this.actions.startActivation();

    const stringifiedConfig = window.localStorage.getItem(
      localStorageConfigKey,
    );
    if (stringifiedConfig) {
      try {
        const config = JSON.parse(stringifiedConfig);
        this.activate(config);
      } catch (error) {
        console.debug('Could not connect eagerly', error);
        cancelActivation();
      }
    }
  }
}
