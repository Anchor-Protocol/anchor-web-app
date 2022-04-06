import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';
import { SupportedChainRpcs } from '../constants';

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(
      actions,
      {
        rpc: SupportedChainRpcs,
      },
      false,
    ),
  Object.keys(SupportedChainRpcs).map((chainId) => Number(chainId)),
);
