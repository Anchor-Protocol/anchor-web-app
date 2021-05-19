import { AddressMap, AddressProvider } from '@anchor-protocol/anchor.js';
import { QueryDependencyProvider } from '@anchor-protocol/queries';
import { ContractAddress, Rate, uUST } from '@anchor-protocol/types';
import { AnchorWebappProvider } from '@anchor-protocol/webapp-provider';
import {
  ApolloClient,
  ApolloError,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { captureException } from '@sentry/react';
import { OperationBroadcaster } from '@terra-dev/broadcastable-operation';
import { GlobalDependency } from '@terra-dev/broadcastable-operation/global';
import { GlobalStyle } from '@terra-dev/neumorphism-ui/themes/GlobalStyle';
import { patchReactQueryFocusRefetching } from '@terra-dev/patch-react-query-focus-refetching';
import { ReadonlyWalletSession } from '@terra-dev/readonly-wallet';
import { SnackbarProvider } from '@terra-dev/snackbar';
import { BrowserInactiveProvider } from '@terra-dev/use-browser-inactive';
import { GoogleAnalytics } from '@terra-dev/use-google-analytics';
import { useLongtimeNoSee } from '@terra-dev/use-longtime-no-see';
import { RouterScrollRestoration } from '@terra-dev/use-router-scroll-restoration';
import { NetworkInfo } from '@terra-money/wallet-provider';
import {
  ExtensionNetworkOnlyWalletProvider,
  RouterWalletStatusRecheck,
  useWallet,
  WalletProvider,
} from '@terra-money/wallet-provider/react';
import { TerraWebappProvider } from '@terra-money/webapp-provider';
import { useReadonlyWalletDialog } from 'base/components/useReadonlyWalletDialog';
import { useRequestReloadDialog } from 'base/components/useRequestReload';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { BroadcastingContainer } from './components/BroadcastingContainer';
import { SnackbarContainer } from './components/SnackbarContainer';
import { BankProvider } from './contexts/bank';
import { Constants, ConstantsProvider } from './contexts/contants';
import { ContractProvider } from './contexts/contract';
import { ThemeProvider } from './contexts/theme';
import {
  ADDRESS_PROVIDERS,
  ADDRESSES,
  columbusContractAddresses,
  defaultNetwork,
  GA_TRACKING_ID,
  tequilaContractAddresses,
} from './env';

patchReactQueryFocusRefetching();

const queryClient = new QueryClient();

const operationBroadcasterErrorReporter =
  process.env.NODE_ENV === 'production' ? captureException : undefined;

function Providers({ children }: { children: ReactNode }) {
  const { post, network } = useWallet();

  const isMainnet = useMemo(() => /^columbus/.test(network.chainID), [
    network.chainID,
  ]);

  const addressMap = useMemo<AddressMap>(() => {
    return isMainnet ? columbusContractAddresses : tequilaContractAddresses;
  }, [isMainnet]);

  const addressProvider = useMemo<AddressProvider>(() => {
    return isMainnet ? ADDRESS_PROVIDERS.mainnet : ADDRESS_PROVIDERS.testnet;
  }, [isMainnet]);

  const address = useMemo<ContractAddress>(() => {
    return isMainnet ? ADDRESSES.mainnet : ADDRESSES.testnet;
  }, [isMainnet]);

  const client = useMemo<ApolloClient<any>>(() => {
    const httpLink = new HttpLink({
      uri: ({ operationName }) =>
        isMainnet
          ? `https://mantle.anchorprotocol.com?${operationName}`
          : `https://tequila-mantle.anchorprotocol.com?${operationName}`,
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    });
  }, [isMainnet]);

  const constants = useMemo<Constants>(
    () =>
      isMainnet
        ? {
            gasFee: 1000000 as uUST<number>,
            fixedGas: 250000 as uUST<number>,
            blocksPerYear: 4906443,
            gasAdjustment: 1.6 as Rate<number>,
          }
        : {
            gasFee: 6000000 as uUST<number>,
            fixedGas: 3500000 as uUST<number>,
            blocksPerYear: 4906443,
            gasAdjustment: 1.4 as Rate<number>,
          },
    [isMainnet],
  );

  const operationGlobalDependency = useMemo<GlobalDependency>(
    () => ({
      addressProvider,
      address,
      client,
      post,
      ...constants,
    }),
    [address, addressProvider, client, constants, post],
  );

  const onQueryError = useCallback((error: ApolloError) => {
    console.error('AppProviders.tsx..()', error);
  }, []);

  return (
    /** React App routing :: <Link>, <NavLink>, useLocation(), useRouteMatch()... */
    <Router>
      <QueryClientProvider client={queryClient}>
        <BrowserInactiveProvider>
          <TerraWebappProvider
            txErrorReporter={operationBroadcasterErrorReporter}
          >
            <AnchorWebappProvider>
              {/** Serve Constants */}
              <ConstantsProvider {...constants}>
                {/** Smart Contract Address :: useAddressProvider() */}
                <ContractProvider
                  addressProvider={addressProvider}
                  addressMap={addressMap}
                >
                  {/** Set GraphQL environenments :: useQuery(), useApolloClient()... */}
                  <ApolloProvider client={client}>
                    {/** Broadcastable Query Provider :: useBroadCastableQuery(), useQueryBroadCaster() */}
                    <OperationBroadcaster
                      dependency={operationGlobalDependency}
                      errorReporter={operationBroadcasterErrorReporter}
                    >
                      {/** Query dependencies :: @anchor-protocol/queries, useWasmQuery()... */}
                      <QueryDependencyProvider
                        client={client}
                        address={address}
                        onError={onQueryError}
                      >
                        {/** User Balances (uUSD, uLuna, ubLuna, uaUST...) :: useBank() */}
                        <BankProvider>
                          {/** Theme Providing to Styled-Components and Material-UI */}
                          <ThemeProvider initialTheme="light">
                            {/** Snackbar Provider :: useSnackbar() */}
                            <SnackbarProvider>
                              {/** Application Layout */}
                              {children}
                            </SnackbarProvider>
                          </ThemeProvider>
                        </BankProvider>
                      </QueryDependencyProvider>
                    </OperationBroadcaster>
                  </ApolloProvider>
                </ContractProvider>
              </ConstantsProvider>
            </AnchorWebappProvider>
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
  const [
    openReadonlyWalletSelector,
    readonlyWalletSelectorElement,
  ] = useReadonlyWalletDialog();

  const [_openRequestReload, requestReloadElement] = useRequestReloadDialog();

  const openRequestReload = useCallback(() => _openRequestReload({}), [
    _openRequestReload,
  ]);

  const createReadonlyWalletSession = useCallback(
    (networks: NetworkInfo[]): Promise<ReadonlyWalletSession | null> => {
      return openReadonlyWalletSelector({
        networks,
      });
    },
    [openReadonlyWalletSelector],
  );

  // If the user didn't see the app over 30 minutes,
  // reload browser for more stablity when the user visit again.
  useLongtimeNoSee({ longtime: 1000 * 60 * 30, onSee: openRequestReload });

  return (
    /** Terra Station Wallet Address :: useWallet() */
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
      connectorOpts={{
        //bridge: 'https://bridge.interus.net',
        bridge: 'https://pancakeswap.bridge.walletconnect.org/',
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
        {/** Operation Result Broadcasting Render Container (Snackbar...) */}
        <BroadcastingContainer />
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
        {/** Operation Result Broadcasting Render Container (Snackbar...) */}
        <BroadcastingContainer />
        <SnackbarContainer />
      </Providers>
    </ExtensionNetworkOnlyWalletProvider>
  );
}
