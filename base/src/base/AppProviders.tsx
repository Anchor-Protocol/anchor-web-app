import { AddressMap, AddressProvider } from '@anchor-protocol/anchor.js';
import { QueryDependencyProvider } from '@anchor-protocol/queries';
import { ContractAddress, Rate, uUST } from '@anchor-protocol/types';
import {
  ANCHOR_TX_REFETCH_MAP,
  AnchorWebappProvider,
} from '@anchor-protocol/webapp-provider';
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
import {
  ExtensionNetworkOnlyWalletProvider,
  NetworkInfo,
  RouterWalletStatusRecheck,
  useWallet,
  WalletProvider,
} from '@terra-money/wallet-provider';
import {
  BankProvider as WebappBankProvider,
  CW20Contract,
  TerraWebappProvider,
} from '@terra-money/webapp-provider';
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
  const { post, network } = useWallet();

  // TODO remove after refactoring done
  const isMainnet = useMemo(() => /^columbus/.test(network.chainID), [
    network.chainID,
  ]);

  // TODO remove after refactoring done
  const addressMap = useMemo<AddressMap>(() => {
    return isMainnet ? columbusContractAddresses : tequilaContractAddresses;
  }, [isMainnet]);

  // TODO remove after refactoring done
  const addressProvider = useMemo<AddressProvider>(() => {
    return isMainnet ? ADDRESS_PROVIDERS.mainnet : ADDRESS_PROVIDERS.testnet;
  }, [isMainnet]);

  // TODO remove after refactoring done
  const address = useMemo<ContractAddress>(() => {
    return isMainnet ? ADDRESSES.mainnet : ADDRESSES.testnet;
  }, [isMainnet]);

  // TODO remove after refactoring done
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

  // TODO remove after refactoring done
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

  // TODO remove after refactoring done
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
            txRefetchMap={ANCHOR_TX_REFETCH_MAP}
            txErrorReporter={operationBroadcasterErrorReporter}
          >
            <WebappBankProvider
              cw20TokenContracts={cw20TokenContracts}
              maxCapTokenDenoms={maxCapTokenDenoms}
            >
              <AnchorWebappProvider>
                {/**
                 Serve Constants
                 TODO remove after refactoring done
                 */}
                <ConstantsProvider {...constants}>
                  {/**
                   Smart Contract Address :: useAddressProvider()
                   TODO remove after refactoring done
                   */}
                  <ContractProvider
                    addressProvider={addressProvider}
                    addressMap={addressMap}
                  >
                    {/**
                     Set GraphQL environenments :: useQuery(), useApolloClient()...
                     TODO remove after refactoring done
                     */}
                    <ApolloProvider client={client}>
                      {/**
                       Broadcastable Query Provider :: useBroadCastableQuery(), useQueryBroadCaster()
                       TODO remove after refactoring done
                       */}
                      <OperationBroadcaster
                        dependency={operationGlobalDependency}
                        errorReporter={operationBroadcasterErrorReporter}
                      >
                        {/**
                         Query dependencies :: @anchor-protocol/queries, useWasmQuery()...
                         TODO remove after refactoring done
                         */}
                        <QueryDependencyProvider
                          client={client}
                          address={address}
                          onError={onQueryError}
                        >
                          {/**
                           User Balances (uUSD, uLuna, ubLuna, uaUST...) :: useBank()
                           TODO remove after refactoring done
                           */}
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
        //bridge: 'https://relay01.interus.net/',
        //bridge: 'https://relay02.interus.net/',
        //bridge: 'https://pancakeswap.bridge.walletconnect.org/',
        //bridge: 'https://walletconnect.terra.dev/',
        bridge: 'https://tequila-walletconnect.terra.dev/',
        //bridge: onProduction
        //  ? 'https://walletconnect.terra.dev/'
        //  : 'https://tequila-walletconnect.terra.dev/',
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
