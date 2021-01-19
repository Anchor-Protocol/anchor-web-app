import { AddressProviderFromJson } from '@anchor-protocol/anchor-js/address-provider';
import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider/provider';
import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import { SnackbarProvider } from '@anchor-protocol/snackbar';
import { QueryBroadcaster } from '@anchor-protocol/use-broadcastable-query';
import { RouterScrollRestoration } from '@anchor-protocol/use-router-scroll-restoration';
import {
  ChromeExtensionWalletProvider,
  RouterWalletStatusRecheck,
} from '@anchor-protocol/wallet-provider';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Banner } from 'components/Banner';
import { Header } from 'components/Header';
import { SnackbarContainer } from 'components/snackbar/SnackbarContainer';
import { BankProvider } from 'contexts/bank';
import { ContractProvider } from 'contexts/contract';
import { contractAddresses, defaultNetwork } from 'env';
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
  //const {status} = useWallet(); // of @anchor-protocol/wallet-provider

  const addressProvider = useMemo<AddressProvider>(() => {
    // TODO create address provider by wallet info
    return new AddressProviderFromJson(contractAddresses);
  }, []);

  const client = useMemo<ApolloClient<any>>(() => {
    // TODO create endpoint by wallet info
    return new ApolloClient({
      uri: 'https://tequila-mantle.terra.dev',
      cache: new InMemoryCache(),
    });
  }, []);

  return (
    /**
     * Smart Contract Address
     * useAddressProvider()
     */
    <ContractProvider addressProvider={addressProvider}>
      {/**
       * Set GraphQL environenments
       * useQuery(), useApolloClient()...
       */}
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ContractProvider>
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
      {/**
       * Scroll Restore when basepath changed (page moved)
       */}
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
           * Broadcastable Query Provider
           * useBroadCastableQuery(), useQueryBroadCaster()
           *
           * @see ../../packages/src/@anchor-protocol/use-broadcastable-query
           */}
          <QueryBroadcaster>
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
              <ThemeProvider theme={darkTheme}>
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
                  <SnackbarContainer />
                  {/** End Layout */}
                </SnackbarProvider>
              </ThemeProvider>
            </BankProvider>
          </QueryBroadcaster>
        </WalletConnectedProviders>
      </ChromeExtensionWalletProvider>
    </Router>
  );
}

export const App = styled(AppBase)`
  // TODO
`;
