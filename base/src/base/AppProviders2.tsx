import {
  AddressProvider,
  AddressProviderFromJson,
} from '@anchor-protocol/anchor.js';
import { QueryDependencyProvider } from '@anchor-protocol/queries';
import { ContractAddress, Rate, uUST } from '@anchor-protocol/types';
import {
  RouterWalletStatusRecheck,
  useWallet,
  WalletProvider,
} from '@anchor-protocol/wallet-provider2';
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
import { StationNetworkInfo } from '@terra-dev/extension';
import { GlobalStyle } from '@terra-dev/neumorphism-ui/themes/GlobalStyle';
import { SnackbarProvider } from '@terra-dev/snackbar';
import { GoogleAnalytics } from '@terra-dev/use-google-analytics';
import { RouterScrollRestoration } from '@terra-dev/use-router-scroll-restoration';
import { ReactNode, useCallback, useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { BroadcastingContainer } from './components/BroadcastingContainer';
import { SnackbarContainer } from './components/SnackbarContainer';
import { BankProvider } from './contexts/bank';
import { Constants, ConstantsProvider } from './contexts/contants';
import { ContractProvider, createContractAddress } from './contexts/contract';
import { ThemeProvider } from './contexts/theme';
import {
  columbusContractAddresses,
  defaultNetwork,
  GA_TRACKING_ID,
  tequilaContractAddresses,
} from './env';

const operationBroadcasterErrorReporter =
  process.env.NODE_ENV === 'production' ? captureException : undefined;

function Providers({ children }: { children: ReactNode }) {
  const { post, network } = useWallet();

  const isMainnet = useMemo(() => /^columbus/.test(network.chainID), [
    network.chainID,
  ]);

  const addressMap = useMemo(() => {
    return isMainnet ? columbusContractAddresses : tequilaContractAddresses;
  }, [isMainnet]);

  const addressProvider = useMemo<AddressProvider>(() => {
    return new AddressProviderFromJson(addressMap);
  }, [addressMap]);

  const address = useMemo<ContractAddress>(() => {
    return createContractAddress(addressProvider, addressMap);
  }, [addressMap, addressProvider]);

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
    </Router>
  );
}

const walletConnectChainIds = new Map<number, StationNetworkInfo>([
  [
    0,
    {
      chainID: 'columbus-4',
      fcd: 'https://fcd.terra.dev',
      lcd: 'https://lcd.terra.dev',
      name: 'mainnet',
      ws: 'wss://fcd.terra.dev',
    },
  ],
  [
    1,
    {
      chainID: 'tequila-0004',
      fcd: 'https://tequila-fcd.terra.dev',
      lcd: 'https://tequila-lcd.terra.dev',
      name: 'testnet',
      ws: 'wss://tequila-ws.terra.dev',
    },
  ],
]);

export function AppProviders2({ children }: { children: ReactNode }) {
  return (
    /** Terra Station Wallet Address :: useWallet() */
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
      connectorOpts={{
        bridge: 'https://bridge.interus.net',
      }}
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
      </Providers>
    </WalletProvider>
  );
}
