import {
  ANCHOR_TX_REFETCH_MAP,
  AnchorWebappProvider,
} from '@anchor-protocol/webapp-provider';
import { captureException } from '@sentry/react';
import { GlobalStyle } from '@terra-dev/neumorphism-ui/themes/GlobalStyle';
import { patchReactQueryFocusRefetching } from '@terra-dev/patch-react-query-focus-refetching';
import { ReadonlyWalletSession } from '@terra-dev/readonly-wallet';
import { SnackbarProvider } from '@terra-dev/snackbar';
import { BrowserInactiveProvider } from '@terra-dev/use-browser-inactive';
import { GoogleAnalytics } from '@terra-dev/use-google-analytics';
import { useLongtimeNoSee } from '@terra-dev/use-longtime-no-see';
import { RouterScrollRestoration } from '@terra-dev/use-router-scroll-restoration';
import { RouterWalletStatusRecheck } from '@terra-dev/use-router-wallet-status-recheck';
import {
  ExtensionNetworkOnlyWalletProvider,
  NetworkInfo,
  WalletProvider,
} from '@terra-money/wallet-provider';
import {
  BankProvider as WebappBankProvider,
  CW20Contract,
  TerraWebappProvider,
} from '@terra-money/webapp-provider';
import { useReadonlyWalletDialog } from 'base/components/useReadonlyWalletDialog';
import { useRequestReloadDialog } from 'base/components/useRequestReload';
import React, { ReactNode, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarContainer } from './components/SnackbarContainer';
import { ThemeProvider } from './contexts/theme';
import { ADDRESSES, defaultNetwork, GA_TRACKING_ID, onProduction } from './env';

patchReactQueryFocusRefetching();

const queryClient = new QueryClient();

const errorReporter =
  process.env.NODE_ENV === 'production' ? captureException : undefined;

const cw20TokenContracts: Record<string, Record<string, CW20Contract>> = {
  mainnet: {
    uaUST: {
      contractAddress: ADDRESSES.mainnet.cw20.aUST,
    },
    ubLuna: {
      contractAddress: ADDRESSES.mainnet.cw20.bLuna,
    },
    uANC: {
      contractAddress: ADDRESSES.mainnet.cw20.ANC,
    },
    uAncUstLP: {
      contractAddress: ADDRESSES.mainnet.cw20.AncUstLP,
    },
    ubLunaLunaLP: {
      contractAddress: ADDRESSES.mainnet.cw20.bLunaLunaLP,
    },
  },
  testnet: {
    uaUST: {
      contractAddress: ADDRESSES.testnet.cw20.aUST,
    },
    ubLuna: {
      contractAddress: ADDRESSES.testnet.cw20.bLuna,
    },
    uANC: {
      contractAddress: ADDRESSES.testnet.cw20.ANC,
    },
    uAncUstLP: {
      contractAddress: ADDRESSES.testnet.cw20.AncUstLP,
    },
    ubLunaLunaLP: {
      contractAddress: ADDRESSES.testnet.cw20.bLunaLunaLP,
    },
  },
};

const maxCapTokenDenoms: Record<string, string> = {
  maxTaxUUSD: 'uusd',
};

function Providers({ children }: { children: ReactNode }) {
  return (
    /** React App routing :: <Link>, <NavLink>, useLocation(), useRouteMatch()... */
    <Router>
      <QueryClientProvider client={queryClient}>
        <BrowserInactiveProvider>
          <TerraWebappProvider
            txRefetchMap={ANCHOR_TX_REFETCH_MAP}
            txErrorReporter={errorReporter}
            queryErrorReporter={errorReporter}
          >
            <WebappBankProvider
              cw20TokenContracts={cw20TokenContracts}
              maxCapTokenDenoms={maxCapTokenDenoms}
            >
              <AnchorWebappProvider>
                {/** Theme Providing to Styled-Components and Material-UI */}
                <ThemeProvider initialTheme="light">
                  {/** Snackbar Provider :: useSnackbar() */}
                  <SnackbarProvider>
                    {/** Application Layout */}
                    {children}
                  </SnackbarProvider>
                </ThemeProvider>
              </AnchorWebappProvider>
            </WebappBankProvider>
          </TerraWebappProvider>
        </BrowserInactiveProvider>
      </QueryClientProvider>
    </Router>
  );
}

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: {
    name: 'testnet',
    chainID: 'tequila-0004',
    lcd: 'https://tequila-lcd.terra.dev',
  },
  1: {
    name: 'mainnet',
    chainID: 'columbus-4',
    lcd: 'https://lcd.terra.dev',
  },
};

export function AppProviders({ children }: { children: ReactNode }) {
  const [openReadonlyWalletSelector, readonlyWalletSelectorElement] =
    useReadonlyWalletDialog();

  const [_openRequestReload, requestReloadElement] = useRequestReloadDialog();

  const openRequestReload = useCallback(
    () => _openRequestReload({}),
    [_openRequestReload],
  );

  const createReadonlyWalletSession = useCallback(
    (networks: NetworkInfo[]): Promise<ReadonlyWalletSession | null> => {
      return openReadonlyWalletSelector({
        networks,
      });
    },
    [openReadonlyWalletSelector],
  );

  // If the user didn't see the app over 60 minutes,
  // reload browser for more stablity when the user visit again.
  useLongtimeNoSee({ longtime: 1000 * 60 * 60, onSee: openRequestReload });

  return (
    /** Terra Station Wallet Address :: useWallet() */
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
      connectorOpts={{
        bridge: onProduction
          ? 'https://walletconnect.terra.dev/'
          : 'https://tequila-walletconnect.terra.dev/',
      }}
      createReadonlyWalletSession={createReadonlyWalletSession}
    >
      <Providers>
        {/* Router Actions ======================== */}
        {/** Send Google Analytics Page view every Router's location changed */}
        <GoogleAnalytics trackingId={GA_TRACKING_ID} />
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

        {readonlyWalletSelectorElement}
        {requestReloadElement}
      </Providers>
    </WalletProvider>
  );
}

export function LandingProviders({ children }: { children: ReactNode }) {
  return (
    /** Terra Station Wallet Address :: useWallet() */
    <ExtensionNetworkOnlyWalletProvider defaultNetwork={defaultNetwork}>
      <Providers>
        {/* Router Actions ======================== */}
        {/** Send Google Analytics Page view every Router's location changed */}
        <GoogleAnalytics trackingId={GA_TRACKING_ID} />
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
      </Providers>
    </ExtensionNetworkOnlyWalletProvider>
  );
}
