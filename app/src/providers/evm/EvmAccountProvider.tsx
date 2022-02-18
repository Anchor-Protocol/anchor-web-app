import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { AccountContext, Account } from 'contexts/account';
import { HumanAddr } from '@libs/types';
import { useEvmWallet } from '@libs/evm-wallet';

const EvmAccountProvider = ({ children }: UIElementProps) => {
  const { address, status } = useEvmWallet();

  const account = useMemo<Account>(() => {
    return {
      status,
      availablePost: true,
      connected: (status === 'connected') as true, // Cast to "true" to fix discriminated union
      nativeWalletAddress: address as HumanAddr,
      network: 'evm',
      readonly: false,
      terraWalletAddress:
        'terra1k529hl5nvrvavnzv4jm3um2lllxujrshpn5um2' as HumanAddr,
    };
  }, [address, status]);

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export { EvmAccountProvider };
