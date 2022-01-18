import { UIElementProps } from '@libs/ui';
import { AppProviders } from 'configurations/app';
import { EvmTokenBalancesProvider } from 'providers/evm/EvmTokenBalancesProvider';
import React from 'react';

export function EvmAppProviders({ children }: UIElementProps) {
  return (
    <AppProviders>
      <EvmTokenBalancesProvider>{children}</EvmTokenBalancesProvider>
    </AppProviders>
  );
}
