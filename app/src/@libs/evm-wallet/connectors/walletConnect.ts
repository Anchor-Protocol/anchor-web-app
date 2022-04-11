import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';
import { SupportedChainRpcs } from '../constants';

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
    Object.keys(SupportedChainRpcs).map((chainId) => Number(chainId)),
  );
