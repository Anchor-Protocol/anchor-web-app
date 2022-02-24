import React from 'react';
import { EvmWalletProvider } from '@libs/evm-wallet';
import { UIElementProps } from '@libs/ui';
import { AppProviders } from 'configurations/app';
import { EvmAccountProvider } from './EvmAccountProvider';
import { EvmBalancesProvider } from './EvmBalancesProvider';
import { EvmNetworkProvider } from './EvmNetworkProvider';

export function EvmAppProviders({ children }: UIElementProps) {
  return (
    <EvmWalletProvider>
      <EvmNetworkProvider>
        <EvmAccountProvider>
          <AppProviders>
            <EvmBalancesProvider>{children}</EvmBalancesProvider>
          </AppProviders>
        </EvmAccountProvider>
      </EvmNetworkProvider>
    </EvmWalletProvider>
  );
}
