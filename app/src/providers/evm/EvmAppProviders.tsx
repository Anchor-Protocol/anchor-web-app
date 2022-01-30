import React from 'react';
import { EvmWalletProvider } from '@libs/evm-wallet';
import { UIElementProps } from '@libs/ui';
import { AppProviders } from 'configurations/app';
import { EvmAccountProvider } from './EvmAccountProvider';
import { EvmAnchorApiProvider } from './EvmAnchorApiProvider';
import { EvmTokenBalancesProvider } from './EvmTokenBalancesProvider';

export function EvmAppProviders({ children }: UIElementProps) {
  return (
    <AppProviders>
      <EvmWalletProvider>
        <EvmAccountProvider>
          <EvmAnchorApiProvider>
            <EvmTokenBalancesProvider>{children}</EvmTokenBalancesProvider>
          </EvmAnchorApiProvider>
        </EvmAccountProvider>
      </EvmWalletProvider>
    </AppProviders>
  );
}
