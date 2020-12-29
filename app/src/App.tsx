import { AddressProviderFromEnvVar } from '@anchor-protocol/anchor-js/address-provider';
import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import { ApolloProvider } from '@apollo/client';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { mantleClient } from 'env';
import { BAsset } from 'pages/basset';
import { Borrow } from 'pages/borrow';
import { Earn } from 'pages/earn';
import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import styled from 'styled-components';
import { useWalletState, WalletProvider } from './hooks/use-wallet';
import { AddressProviderProvider as ContractAddressProvider } from './providers/address-provider';

interface AppProps {
  className?: string;
}

function AppBase({ className }: AppProps) {
  const wallet = useWalletState();

  return (
    // React App routing
    <Router>
      {/* Smart Contract Address */}
      <ContractAddressProvider value={new AddressProviderFromEnvVar()}>
        {/* Terra Station Wallet Address */}
        <WalletProvider value={wallet} key={wallet.address}>
          {/* Set GraphQL environenments */}
          <ApolloProvider client={mantleClient}>
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
            </ThemeProvider>
          </ApolloProvider>
        </WalletProvider>
      </ContractAddressProvider>
    </Router>
  );
}

export const App = styled(AppBase)`
  // TODO
`;
