import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { AccountContext, Account } from 'contexts/account';
import { HumanAddr } from '@libs/types';

const EvmAccountProvider = ({ children }: UIElementProps) => {
  const account = useMemo<Account>(() => {
    return {
      nativeWalletAddress: '0xABC' as HumanAddr,
      terraWalletAddress:
        'terra1k529hl5nvrvavnzv4jm3um2lllxujrshpn5um2' as HumanAddr,
      connected: true,
      readonly: false,
      availablePost: true,
    };
  }, []);
  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export { EvmAccountProvider };
