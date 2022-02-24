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

export function EvmAppProviders({ children }: UIElementProps) {
  const { chain } = useDeploymentTarget();
  return (
    <EvmWalletProvider>
      <EvmNetworkProvider>
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
      </EvmNetworkProvider>
    </EvmWalletProvider>
  );
}
