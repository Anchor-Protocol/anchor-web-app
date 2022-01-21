import { UIElementProps } from '@libs/ui';
import { AppProviders } from 'configurations/app';
import { EvmAccountProvider } from './EvmAccountProvider';
import { EvmTokenBalancesProvider } from './EvmTokenBalancesProvider';
import React from 'react';
import { EvmAnchorApiProvider } from './EvmAnchorApiProvider';

export function EvmAppProviders({ children }: UIElementProps) {
  return (
    <AppProviders>
      <EvmAccountProvider>
        <EvmAnchorApiProvider>
          <EvmTokenBalancesProvider>{children}</EvmTokenBalancesProvider>
        </EvmAnchorApiProvider>
      </EvmAccountProvider>
    </AppProviders>
  );
}
