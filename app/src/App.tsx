import { AddressProviderFromJson } from '@anchor-protocol/anchor-js/address-provider';
import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider/provider';
import { OperationBroadcaster } from '@anchor-protocol/broadcastable-operation';
import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { Ratio, uUST } from '@anchor-protocol/notation';
import { SnackbarProvider } from '@anchor-protocol/snackbar';
import { GoogleAnalytics } from '@anchor-protocol/use-google-analytics';
import { RouterScrollRestoration } from '@anchor-protocol/use-router-scroll-restoration';
import {
  ChromeExtensionWalletProvider,
  RouterWalletStatusRecheck,
  useWallet,
} from '@anchor-protocol/wallet-provider';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { Banner } from 'components/Banner';
import { BroadcastingContainer } from 'components/BroadcastingContainer';
import { Header } from 'components/Header';
import { BankProvider } from 'contexts/bank';
import { ContractProvider } from 'contexts/contract';
import { NetConstants, NetConstantsProvider } from 'contexts/net-contants';
import { ThemeProvider } from 'contexts/theme';
import { contractAddresses, defaultNetwork, GA_TRACKING_ID } from 'env';
import { BAsset } from 'pages/basset';
import { Borrow } from 'pages/borrow';
import { Earn } from 'pages/earn';
import { ReactNode, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import styled from 'styled-components';

interface AppProps {
  className?: string;
}

function WalletConnectedProviders({ children }: { children: ReactNode }) {
  const { post } = useWallet();

  const addressProvider = useMemo<AddressProvider>(() => {
    // TODO create address provider by wallet info
    return new AddressProviderFromJson(contractAddresses);
  }, []);

  const client = useMemo<ApolloClient<any>>(() => {
    const httpLink = new HttpLink({
      uri: ({ operationName }) =>
        `https://tequila-mantle.terra.dev?${operationName}`,
    });

    // TODO create endpoint by wallet info
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    });
  }, []);

  const netConstants = useMemo<NetConstants>(
    () => ({
      gasFee: 6000000 as uUST<number>,
      fixedGas: 3500000 as uUST<number>,
      blocksPerYear: 5256666,
      gasAdjustment: 1.4 as Ratio<number>,
    }),
    [],
  );

  return (
    <NetConstantsProvider {...netConstants}>
      {/**
       * Smart Contract Address * useAddressProvider()
       */}
      <ContractProvider addressProvider={addressProvider}>
        {/**
         * Set GraphQL environenments
         * useQuery(), useApolloClient()...
         */}
        <ApolloProvider client={client}>
          {/**
           * Broadcastable Query Provider
           * useBroadCastableQuery(), useQueryBroadCaster()
           *
           * @see ../../packages/src/@anchor-protocol/use-broadcastable-query
           */}
          <OperationBroadcaster
            dependency={{
              addressProvider,
              client,
              post,
              ...netConstants,
            }}
          >
            {children}
          </OperationBroadcaster>
        </ApolloProvider>
      </ContractProvider>
    </NetConstantsProvider>
  );
}

function AppBase({ className }: AppProps) {
  return (
    /**
     * React App routing
     * <Link>, <NavLink>, useLocation(), useRouteMatch()...
     *
     * @link https://reactrouter.com/web/guides/quick-start
     */
    <Router>
      {/** Send Google Analytics Page view when router's location changed */}
      <GoogleAnalytics trackingId={GA_TRACKING_ID} />
      {/** Scroll Restore when basepath changed (page moved) */}
      <RouterScrollRestoration />
      {/**
       * Terra Station Wallet Address
       * useWallet()
       */}
      <ChromeExtensionWalletProvider defaultNetwork={defaultNetwork}>
        {/**
         * Re-Check Terra Station Wallet Status when Router pathname changed
         */}
        <RouterWalletStatusRecheck />
        <WalletConnectedProviders>
          {/**
           * User Balances (uUSD, uLuna, ubLuna, uaUST...)
           * useBank()
           */}
          <BankProvider>
            {/**
             * Theme Providing to Styled-Components and Material-UI
             *
             * @example
             * ```
             * styled.div`
             *   color: ${({theme}) => theme.textColor}
             * `
             * ```
             */}
            <ThemeProvider initialTheme="light">
              {/**
               * Snackbar Provider
               * useSnackbar()
               */}
              <SnackbarProvider>
                {/**
                 * Styled-Components Global CSS
                 */}
                <GlobalStyle />
                {/** Start Layout */}
                <div className={className}>
                  <Header />
                  <Banner />
                  <Switch>
                    <Route path="/earn" component={Earn} />
                    <Route path="/borrow" component={Borrow} />
                    <Route path="/basset" component={BAsset} />
                    <Redirect to="/earn" />
                  </Switch>
                </div>
                {/**
                 * Snackbar Container
                 * Snackbar Floating (position: fixed) Container
                 */}
                <BroadcastingContainer />
                {/** End Layout */}
              </SnackbarProvider>
            </ThemeProvider>
          </BankProvider>
        </WalletConnectedProviders>
      </ChromeExtensionWalletProvider>
    </Router>
  );
}

export const App = styled(AppBase)`
  // TODO
`;
