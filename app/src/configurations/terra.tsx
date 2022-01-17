import { RouterWalletStatusRecheck } from '@libs/use-router-wallet-status-recheck';
import {
  NetworkInfo,
  ReadonlyWalletSession,
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { useReadonlyWalletDialog } from 'components/dialogs/useReadonlyWalletDialog';
import React, { ReactNode, useCallback } from 'react';
import { AppProviders } from './app';

export function TerraAppProviders({
  children,
  walletConnectChainIds,
  defaultNetwork,
}: { children: ReactNode } & WalletControllerChainOptions) {
  const [openReadonlyWalletSelector, readonlyWalletSelectorElement] =
    useReadonlyWalletDialog();

  const createReadonlyWalletSession = useCallback(
    (networks: NetworkInfo[]): Promise<ReadonlyWalletSession | null> => {
      return openReadonlyWalletSelector({
        networks,
      });
    },
    [openReadonlyWalletSelector],
  );

  return (
    /** Terra Station Wallet Address :: useWallet() */
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
      connectorOpts={{ bridge: 'https://walletconnect.terra.dev/' }}
      createReadonlyWalletSession={createReadonlyWalletSession}
    >
      <AppProviders dialogs={readonlyWalletSelectorElement}>
        {/** Re-Check Terra Station Wallet Status every Router's pathname changed */}
        <RouterWalletStatusRecheck />
        {children}
      </AppProviders>
    </WalletProvider>
  );
}
