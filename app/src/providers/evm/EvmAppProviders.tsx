import React from 'react';
import { EvmWalletProvider } from '@libs/evm-wallet';
import { UIElementProps } from '@libs/ui';
import { AppProviders } from 'configurations/app';
import { EvmAccountProvider } from './EvmAccountProvider';
import { EvmBalancesProvider } from './EvmBalancesProvider';
import { EvmNetworkProvider } from './EvmNetworkProvider';
import { ThemeProvider } from 'contexts/theme';
import { lightTheme as ethereumLightTheme } from 'themes/ethereum/lightTheme';
import { lightTheme as avalancheLightTheme } from 'themes/avalanche/lightTheme';
import { Chain, useDeploymentTarget } from '@anchor-protocol/app-provider';
import { QueryProvider } from 'providers/QueryProvider';

export function EvmAppProviders({ children }: UIElementProps) {
  const {
    target: { chain },
  } = useDeploymentTarget();
  return (
    <EvmWalletProvider>
      <EvmNetworkProvider>
        <QueryProvider>
          <EvmAccountProvider>
            <ThemeProvider
              initialTheme="light"
              lightTheme={
                chain === Chain.Ethereum
                  ? ethereumLightTheme
                  : avalancheLightTheme
              }
            >
              <AppProviders>
                <EvmBalancesProvider>{children}</EvmBalancesProvider>
              </AppProviders>
            </ThemeProvider>
          </EvmAccountProvider>
        </QueryProvider>
      </EvmNetworkProvider>
    </EvmWalletProvider>
  );
}
