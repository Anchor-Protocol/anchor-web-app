import React from 'react';
import { UIElementProps } from '@libs/ui';
import { RouterWalletStatusRecheck } from '@libs/use-router-wallet-status-recheck';
import {
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { AppProviders } from 'configurations/app';
import { TerraAccountProvider } from './TerraAccountProvider';
import { TerraBalancesProvider } from './TerraBalancesProvider';
import { TerraNetworkProvider } from './TerraNetworkProvider';
import { ThemeProvider } from 'contexts/theme';
import { lightTheme, darkTheme } from 'themes/terra';
import { QueryProvider } from 'providers/QueryProvider';
import { useCreateReadOnlyWallet } from 'components/dialogs/CreateReadOnlyWallet/terra/useCreateReadOnlyWallet';

export function TerraAppProviders({
  children,
  walletConnectChainIds,
  defaultNetwork,
}: UIElementProps & WalletControllerChainOptions) {
  const [createReadOnlyWalletSession, createReadonlyWalletDialog] =
    useCreateReadOnlyWallet();

  return (
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
      connectorOpts={{ bridge: 'https://walletconnect.terra.dev/' }}
      createReadOnlyWalletSession={createReadOnlyWalletSession}
    >
      <TerraNetworkProvider>
        <QueryProvider>
          <TerraAccountProvider>
            <ThemeProvider
              initialTheme="light"
              lightTheme={lightTheme}
              darkTheme={darkTheme}
            >
              <AppProviders dialogs={createReadonlyWalletDialog}>
                <TerraBalancesProvider>
                  <RouterWalletStatusRecheck />
                  {children}
                </TerraBalancesProvider>
              </AppProviders>
            </ThemeProvider>
          </TerraAccountProvider>
        </QueryProvider>
      </TerraNetworkProvider>
    </WalletProvider>
  );
}
