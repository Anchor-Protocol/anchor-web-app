import { AddressProviderFromJson } from '@anchor-protocol/anchor-js/address-provider';
import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider/provider';
import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import { SnackbarProvider } from '@anchor-protocol/snackbar';
import { QueryBroadcaster } from '@anchor-protocol/use-broadcastable-query';
import { ChromeExtensionWalletProvider } from '@anchor-protocol/wallet-provider';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { contractAddresses } from 'env';
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
import { AddressProviderProvider as ContractAddressProvider } from './providers/address-provider';
import { SnackbarContainer } from 'components/snackbar/SnackbarContainer';

interface AppProps {
  className?: string;
}

function WalletConnectedProviders({ children }: { children: ReactNode }) {
  //const {} = useWallet(); // of @anchor-protocol/wallet-provider

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
    /* Smart Contract Address */
    <ContractAddressProvider value={addressProvider}>
      {/* Set GraphQL environenments */}
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ContractAddressProvider>
  );
}

function AppBase({ className }: AppProps) {
  return (
    /* React App routing */
    <Router>
      {/* Terra Station Wallet Address */}
      <ChromeExtensionWalletProvider>
        <WalletConnectedProviders>
          {/* Broadcastable Query Provider */}
          <QueryBroadcaster>
            {/* Snackbar Provider */}
            <SnackbarProvider>
              {/* Theme for Styled-Components and Material-UI */}
              <ThemeProvider theme={darkTheme}>
                {/* Global CSS */}
                <GlobalStyle />
                {/* Start Layout */}
                <div className={className}>
                  <Header />
                  <Switch>
                    <Route path="/earn" component={Earn} />
                    <Route path="/borrow" component={Borrow} />
                    <Route path="/basset" component={BAsset} />
                    <Redirect to="/earn" />
                  </Switch>
                  <Footer />
                </div>
                {/* End Layout */}
                {/* SnackbarContainer */}
                <SnackbarContainer />
              </ThemeProvider>
            </SnackbarProvider>
          </QueryBroadcaster>
        </WalletConnectedProviders>
      </ChromeExtensionWalletProvider>
    </Router>
  );
}

export const App = styled(AppBase)`
  // TODO
`;
