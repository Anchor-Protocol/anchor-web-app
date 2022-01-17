import {
  AnchorConstants,
  AnchorContractAddress,
  AnchorWebappProvider,
} from '@anchor-protocol/app-provider';
import { AppProvider } from '@libs/app-provider';
import { GlobalStyle } from '@libs/neumorphism-ui/themes/GlobalStyle';
import { patchReactQueryFocusRefetching } from '@libs/patch-react-query-focus-refetching';
import { SnackbarProvider } from '@libs/snackbar';
import { useLongtimeNoSee } from '@libs/use-longtime-no-see';
import { RouterScrollRestoration } from '@libs/use-router-scroll-restoration';
import { RouterWalletStatusRecheck } from '@libs/use-router-wallet-status-recheck';
import { captureException } from '@sentry/react';
import {
  NetworkInfo,
  ReadonlyWalletSession,
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { useReadonlyWalletDialog } from 'components/dialogs/useReadonlyWalletDialog';
import { useRequestReloadDialog } from 'components/dialogs/useRequestReloadDialog';
import { SnackbarContainer } from 'components/SnackbarContainer';
import { ThemeProvider } from 'contexts/theme';
import {
  ANCHOR_CONSTANTS,
  ANCHOR_CONTRACT_ADDRESS,
  ANCHOR_INDEXER_API_ENDPOINTS,
  ANCHOR_QUERY_CLIENT,
  ANCHOR_TX_REFETCH_MAP,
} from 'env';
import React, { ReactNode, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';

patchReactQueryFocusRefetching();

const queryClient = new QueryClient();

const errorReporter =
  process.env.NODE_ENV === 'production' ? captureException : undefined;

function Providers({ children }: { children: ReactNode }) {
  return (
    /** React App routing :: <Link>, <NavLink>, useLocation(), useRouteMatch()... */
    <Router>
      <QueryClientProvider client={queryClient}>
        <AppProvider<AnchorContractAddress, AnchorConstants>
          defaultQueryClient={ANCHOR_QUERY_CLIENT}
          contractAddress={ANCHOR_CONTRACT_ADDRESS}
          constants={ANCHOR_CONSTANTS}
          refetchMap={ANCHOR_TX_REFETCH_MAP}
          txErrorReporter={errorReporter}
          queryErrorReporter={errorReporter}
        >
          <AnchorWebappProvider
            indexerApiEndpoints={ANCHOR_INDEXER_API_ENDPOINTS}
          >
            {/** Theme Providing to Styled-Components and Material-UI */}
            <ThemeProvider initialTheme="light">
              {/** Snackbar Provider :: useSnackbar() */}
              <SnackbarProvider>
                {/** Application Layout */}
                {children}
              </SnackbarProvider>
            </ThemeProvider>
          </AnchorWebappProvider>
        </AppProvider>
      </QueryClientProvider>
    </Router>
  );
}

export function AppProviders({
  children,
  dialogs,
}: {
  children: ReactNode;
  dialogs: ReactNode;
}) {
  const [_openRequestReload, requestReloadElement] = useRequestReloadDialog();

  const openRequestReload = useCallback(
    () => _openRequestReload({}),
    [_openRequestReload],
  );

  // If the user didn't see the app over 2 days,
  // reload browser for more stablity when the user visit again.
  useLongtimeNoSee({ longtime: 1000 * 60 * 60 * 48, onSee: openRequestReload });

  return (
    <Providers>
      {/* Router Actions ======================== */}
      {/** Scroll Restore every Router's basepath changed */}
      <RouterScrollRestoration />
      {/** Re-Check Terra Station Wallet Status every Router's pathname changed */}
      <RouterWalletStatusRecheck />
      {/* Theme ================================= */}
      {/** Styled-Components Global CSS */}
      <GlobalStyle />
      {/* Layout ================================ */}
      {children}
      {/* Portal ================================ */}
      <SnackbarContainer />

      {dialogs}
      {requestReloadElement}
    </Providers>
  );
}

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
        {children}
      </AppProviders>
    </WalletProvider>
  );
}
