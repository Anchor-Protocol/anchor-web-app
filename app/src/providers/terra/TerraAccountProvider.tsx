import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import {
  useConnectedWallet,
  useWallet,
  ConnectType,
} from '@terra-money/use-wallet';
import { AccountContext, Account } from 'contexts/account';
import { WalletStatus } from '@terra-money/wallet-provider';
import { HumanAddr } from '../../@libs/types';

const TerraAccountProvider = ({ children }: UIElementProps) => {
  const wallet = useWallet();
  const connectedWallet = useConnectedWallet();
  let walletStatus: Account['status'];

  switch (wallet.status) {
    case WalletStatus.INITIALIZING:
      walletStatus = 'initialization';
      break;
    case WalletStatus.WALLET_CONNECTED:
      walletStatus = 'connected';
      break;
    case WalletStatus.WALLET_NOT_CONNECTED:
    default:
      walletStatus = 'disconnected';
      break;
  }

  const account = useMemo<Account>(() => {
    return {
      connected: !!connectedWallet as true, // Cast to "true" to fix discriminated union
      nativeWalletAddress: connectedWallet?.walletAddress as HumanAddr,
      network: 'terra',
      status: walletStatus,
      terraWalletAddress: connectedWallet?.terraAddress as HumanAddr,
      readonly:
        connectedWallet === undefined ||
        connectedWallet.connectType === ConnectType.READONLY,
      availablePost: !!connectedWallet && connectedWallet.availablePost,
    };
  }, [connectedWallet, walletStatus]);

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export { TerraAccountProvider };
