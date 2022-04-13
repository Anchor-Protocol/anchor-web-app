import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { AccountContext, Account } from 'contexts/account';
import { HumanAddr } from '@libs/types';
import { ConnectType, useEvmWallet, WalletStatus } from '@libs/evm-wallet';
import { useEvmTerraAddressQuery } from 'queries';

const EvmAccountProvider = ({ children }: UIElementProps) => {
  const { address, status, connectionType } = useEvmWallet();

  const { data: terraWalletAddress } = useEvmTerraAddressQuery(address);

  const account = useMemo<Account>(() => {
    const readonly = connectionType === ConnectType.ReadOnly;

    if (status !== WalletStatus.Connected) {
      return {
        status,
        connected: false,
        availablePost: false,
        network: 'evm',
        readonly,
      };
    }
    return {
      status,
      connected: true,
      availablePost: true,
      nativeWalletAddress: address as HumanAddr,
      network: 'evm',
      readonly,
      terraWalletAddress: terraWalletAddress as HumanAddr,
    };
  }, [address, connectionType, status, terraWalletAddress]);

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export { EvmAccountProvider };
