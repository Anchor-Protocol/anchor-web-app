import { AddressProviderFromJson } from '@anchor-protocol/anchor-js/address-provider';
import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider/provider';
import { OperationBroadcaster } from '@anchor-protocol/broadcastable-operation';
import { GlobalDependency } from '@anchor-protocol/broadcastable-operation/global';
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
import { captureException } from '@sentry/react';
import { Banner } from 'components/Banner';
import { BroadcastingContainer } from 'components/BroadcastingContainer';
import { Header } from 'components/Header';
import { BankProvider } from 'contexts/bank';
import { Constants, ConstantsProvider } from 'contexts/contants';
import { ContractProvider } from 'contexts/contract';
import { ServiceProvider } from 'contexts/service';
import { ThemeProvider } from 'contexts/theme';
import { contractAddresses, defaultNetwork, GA_TRACKING_ID } from 'env';
import { BAsset } from 'pages/basset';
import { Borrow } from 'pages/borrow';
import { Earn } from 'pages/earn';
import { Government } from 'pages/gov';
import { govPathname } from 'pages/gov/env';
import { ReactNode, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

const operationBroadcasterErrorReporter =
  process.env.NODE_ENV === 'production' ? captureException : undefined;

function Providers({ children }: { children: ReactNode }) {
  const { post } = useWallet();

  // TODO create address provider depends on wallet info
  const addressProvider = useMemo<AddressProvider>(() => {
    return new AddressProviderFromJson(contractAddresses);
  }, []);

  // TODO create endpoint depends on wallet info
  const client = useMemo<ApolloClient<any>>(() => {
    const httpLink = new HttpLink({
      uri: ({ operationName }) =>
        `https://tequila-mantle.terra.dev?${operationName}`,
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    });
  }, []);

  // TODO create constants depends on wallet info
  const constants = useMemo<Constants>(
    () => ({
      gasFee: 6000000 as uUST<number>,
      fixedGas: 3500000 as uUST<number>,
      blocksPerYear: 5256666,
      gasAdjustment: 1.4 as Ratio<number>,
    }),
    [],
  );

  const operationGlobalDependency = useMemo<GlobalDependency>(
    () => ({
      addressProvider,
      client,
      post,
      ...constants,
    }),
    [addressProvider, client, constants, post],
  );

  return (
    /** React App routing :: <Link>, <NavLink>, useLocation(), useRouteMatch()... */
    <Router>
      {/** Serve Constants */}
      <ConstantsProvider {...constants}>
        {/** Smart Contract Address :: useAddressProvider() */}
        <ContractProvider addressProvider={addressProvider}>
          {/** Set GraphQL environenments :: useQuery(), useApolloClient()... */}
          <ApolloProvider client={client}>
            {/** Broadcastable Query Provider :: useBroadCastableQuery(), useQueryBroadCaster() */}
            <OperationBroadcaster
              dependency={operationGlobalDependency}
              errorReporter={operationBroadcasterErrorReporter}
            >
              {/** Service (Network...) :: useService() */}
              <ServiceProvider>
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
              </ServiceProvider>
            </OperationBroadcaster>
          </ApolloProvider>
        </ContractProvider>
      </ConstantsProvider>
    </Router>
  );
}

export function App() {
  return (
    /** Terra Station Wallet Address :: useWallet() */
    <ChromeExtensionWalletProvider defaultNetwork={defaultNetwork}>
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
        <div>
          <Header />
          <Banner />
          <Switch>
            <Route path="/earn" component={Earn} />
            <Route path="/borrow" component={Borrow} />
            <Route path="/bond" component={BAsset} />
            <Route path={`/${govPathname}`} component={Government} />
            <Redirect to="/earn" />
          </Switch>
        </div>
        {/* Portal ================================ */}
        {/** Operation Result Broadcasting Render Container (Snackbar...) */}
        <BroadcastingContainer />
      </Providers>
    </ChromeExtensionWalletProvider>
  );
}
