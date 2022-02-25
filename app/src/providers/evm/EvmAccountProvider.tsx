import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { AccountContext, Account } from 'contexts/account';
import { HumanAddr } from '@libs/types';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmTerraAddress } from 'crossanchor/useEvmTerraAddress';

const EvmAccountProvider = ({ children }: UIElementProps) => {
  const { address, status } = useEvmWallet();

  const terraWalletAddress = useEvmTerraAddress();

  const account = useMemo<Account>(() => {
    if (status !== 'connected') {
      return {
        status,
        connected: false,
        availablePost: false,
        network: 'evm',
        readonly: true,
      };
    }
    return {
      status,
      connected: true,
      availablePost: true,
      nativeWalletAddress: address as HumanAddr,
      network: 'evm',
      readonly: false,
      terraWalletAddress: terraWalletAddress as HumanAddr,
    };
  }, [address, status, terraWalletAddress]);

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export { EvmAccountProvider };
