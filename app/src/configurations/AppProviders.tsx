import {
  ANCHOR_TX_REFETCH_MAP,
  AnchorWebappProvider,
} from '@anchor-protocol/webapp-provider';
import { GlobalStyle } from '@libs/neumorphism-ui/themes/GlobalStyle';
import { patchReactQueryFocusRefetching } from '@libs/patch-react-query-focus-refetching';
import { SnackbarProvider } from '@libs/snackbar';
import { BrowserInactiveProvider } from '@libs/use-browser-inactive';
import { GoogleAnalytics } from '@libs/use-google-analytics';
import { useLongtimeNoSee } from '@libs/use-longtime-no-see';
import { RouterScrollRestoration } from '@libs/use-router-scroll-restoration';
import { RouterWalletStatusRecheck } from '@libs/use-router-wallet-status-recheck';
import {
  BankProvider as WebappBankProvider,
  CW20Contract,
  TerraWebappProvider,
  webworkerMantleFetch,
} from '@libs/webapp-provider';
import { captureException } from '@sentry/react';
import { ReadonlyWalletSession } from '@terra-dev/readonly-wallet';
import { NetworkInfo, WalletProvider } from '@terra-money/wallet-provider';
import { useReadonlyWalletDialog } from 'components/dialogs/useReadonlyWalletDialog';
import { useRequestReloadDialog } from 'components/dialogs/useRequestReloadDialog';
import { SnackbarContainer } from 'components/SnackbarContainer';
import { ThemeProvider } from 'contexts/theme';
import { ADDRESSES, GA_TRACKING_ID, onProduction } from 'env';
import React, { ReactNode, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';

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
    ubEth: {
      contractAddress: ADDRESSES.mainnet.cw20.bEth,
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
    ubEth: {
      contractAddress: ADDRESSES.testnet.cw20.bEth,
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
  // TODO change to testnet
  bombay: {
    uaUST: {
      contractAddress: ADDRESSES.bombay.cw20.aUST,
    },
    ubLuna: {
      contractAddress: ADDRESSES.bombay.cw20.bLuna,
    },
    ubEth: {
      contractAddress: ADDRESSES.bombay.cw20.bEth,
    },
    uANC: {
      contractAddress: ADDRESSES.bombay.cw20.ANC,
    },
    uAncUstLP: {
      contractAddress: ADDRESSES.bombay.cw20.AncUstLP,
    },
    ubLunaLunaLP: {
      contractAddress: ADDRESSES.bombay.cw20.bLunaLunaLP,
    },
  },
};

const maxCapTokenDenoms: Record<string, string> = {
  maxTaxUUSD: 'uusd',
};

function chromeExtensionCompatibleBrowserCheck(userAgent: string) {
  return /MathWallet\//.test(userAgent) || /BitKeep\//.test(userAgent);
}

function Providers({ children }: { children: ReactNode }) {
  return (
    /** React App routing :: <Link>, <NavLink>, useLocation(), useRouteMatch()... */
    <Router>
      <QueryClientProvider client={queryClient}>
        <BrowserInactiveProvider>
          <TerraWebappProvider
            mantleFetch={webworkerMantleFetch}
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

const testnet = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
};

const mainnet = {
  name: 'mainnet',
  chainID: 'columbus-4',
  lcd: 'https://lcd.terra.dev',
};

// need to force create LCD at least once to get dictToB64/b64ToDict to work correctly
// TODO: remove me after col-5
//new LCDClient({ URL: 'https://bombay-lcd.terra.dev', chainID: 'bombay-10' });

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: testnet,
  1: mainnet,
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
  useLongtimeNoSee({ longtime: 1000 * 60 * 60 * 3, onSee: openRequestReload });

  return (
    /** Terra Station Wallet Address :: useWallet() */
    <WalletProvider
      defaultNetwork={mainnet}
      walletConnectChainIds={walletConnectChainIds}
      connectorOpts={{
        bridge: onProduction
          ? 'https://walletconnect.terra.dev/'
          : 'https://tequila-walletconnect.terra.dev/',
      }}
      createReadonlyWalletSession={createReadonlyWalletSession}
      dangerously__chromeExtensionCompatibleBrowserCheck={
        chromeExtensionCompatibleBrowserCheck
      }
    >
      <Providers>
        {/* Router Actions ======================== */}
        {/** Send Google Analytics Page view every Router's location changed */}
        {typeof GA_TRACKING_ID === 'string' && (
          <GoogleAnalytics trackingId={GA_TRACKING_ID} />
        )}
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
