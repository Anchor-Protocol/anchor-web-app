import { UIElementProps } from '@libs/ui';
import { AppProviders } from 'configurations/app';
import { EvmAccountProvider } from './EvmAccountProvider';
import { EvmTokenBalancesProvider } from './EvmTokenBalancesProvider';
import React from 'react';

export function EvmAppProviders({ children }: UIElementProps) {
  return (
    <AppProviders>
      <EvmAccountProvider>
        <EvmTokenBalancesProvider>{children}</EvmTokenBalancesProvider>
      </EvmAccountProvider>
    </AppProviders>
  );
}
