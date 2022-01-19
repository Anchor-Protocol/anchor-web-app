import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { useConnectedWallet, ConnectType } from '@terra-money/use-wallet';
import { AccountContext, Account } from 'contexts/account';

const TerraAccountProvider = ({ children }: UIElementProps) => {
  const wallet = useConnectedWallet();

  const account = useMemo<Account>(() => {
    return {
      nativeWalletAddress: wallet?.walletAddress,
      terraWalletAddress: wallet?.terraAddress,
      connected: !!wallet,
      readonly:
        wallet === undefined || wallet.connectType === ConnectType.READONLY,
      availablePost: !!wallet && wallet.availablePost,
    };
  }, [wallet]);

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export { TerraAccountProvider };
