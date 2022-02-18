import React from 'react';
import { EvmWalletProvider } from '@libs/evm-wallet';
import { UIElementProps } from '@libs/ui';
import { AppProviders } from 'configurations/app';
import { EvmAccountProvider } from './EvmAccountProvider';
import { EvmContractsProvider } from './EvmContractsProvider';
import { EvmBalancesProvider } from './EvmBalancesProvider';

export function EvmAppProviders({ children }: UIElementProps) {
  return (
    <EvmWalletProvider>
      <EvmAccountProvider>
        <EvmContractsProvider>
          <AppProviders>
            <EvmBalancesProvider>{children}</EvmBalancesProvider>
          </AppProviders>
        </EvmContractsProvider>
      </EvmAccountProvider>
    </EvmWalletProvider>
  );
}
