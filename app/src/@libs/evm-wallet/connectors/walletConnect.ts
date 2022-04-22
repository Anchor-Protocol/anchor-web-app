import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';
import { SupportedChainIds, SupportedChainRpcs } from '../constants';

export const [walletConnect, walletConnectHooks, walletConnectStore] =
  initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect(
        actions,
        {
          rpc: SupportedChainRpcs,
        },
        true,
      ),
    SupportedChainIds,
  );
