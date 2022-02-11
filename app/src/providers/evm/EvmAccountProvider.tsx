import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { AccountContext, Account } from 'contexts/account';
import { HumanAddr } from '@libs/types';
import { useEvmWallet } from '@libs/evm-wallet';

const EvmAccountProvider = ({ children }: UIElementProps) => {
  const { address, status, chainId, connection } = useEvmWallet();

  const account = useMemo<Account>(() => {
    const common = {
      availablePost: true,
      readonly: false,
    };

    return chainId && connection
      ? {
          ...common,
          chainId,
          connected: true,
          status: 'connected',
          nativeWalletAddress: address as HumanAddr,
          terraWalletAddress:
            'terra1k529hl5nvrvavnzv4jm3um2lllxujrshpn5um2' as HumanAddr,
        }
      : {
          ...common,
          chainId: undefined,
          connected: false,
          status: status === 'disconnected' ? 'disconnected' : 'initialization',
          nativeWalletAddress: undefined,
          terraWalletAddress: undefined,
        };
  }, [address, chainId, connection, status]);

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export { EvmAccountProvider };
