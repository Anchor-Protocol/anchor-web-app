import React from 'react';
import { EvmWalletProvider } from '@libs/evm-wallet';
import { UIElementProps } from '@libs/ui';
import { AppProviders } from 'configurations/app';
import { EvmAccountProvider } from './EvmAccountProvider';
import { EvmTokenBalancesProvider } from './EvmTokenBalancesProvider';
import { EvmContractsProvider } from './EvmContractsProvider';

export function EvmAppProviders({ children }: UIElementProps) {
  return (
    <EvmWalletProvider>
      <EvmAccountProvider>
        <EvmContractsProvider>
          <AppProviders>
            <EvmTokenBalancesProvider>{children}</EvmTokenBalancesProvider>
          </AppProviders>
        </EvmContractsProvider>
      </EvmAccountProvider>
    </EvmWalletProvider>
  );
}
