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
    return new AddressProviderFromJson({
      bLunaHub: 'terra10v2xm8wg8462sp8pukc5thc8udxtz6g0f9pym5',
      bAssetToken: 'terra1gqu4yv2y8rkgnywmz8zckp3jv7pxpsaeck4wsh',
      bAssetReward: 'terra1lt9eyey0s7c6umypa0nf86jwyv267c6hyxtxaq',
      mmInterest: 'terra1mga5hxld0g7986j98xxqxzh9x4wzlzrrxj9geg',
      mmOracle: 'terra1fs860v0ke5whgnuxlrz8l7l8hdaxc5akuvq78w',
      mmMarket: 'terra1jnumeaevuvjtyac06mvtremyjjjp9qmhmg6yz6',
      mmOverseer: 'terra1adlsj8e7839z7tqux5yqf5ym3rc96tu87dy4d9',
      mmCustody: 'terra1whaadnzmd764zq2adwrw0ujj953d609ds5ag3g',
      mmLiquidation: 'terra164ea72458h9sn65nnl6xd4qx0f0tgszxwxkx9u',
      anchorToken: 'terra15atfsggre6ux67hwgrlx7fgxgdeq2h9l8anqp7',
      terraswapFactory: 'terra1jfcl4m0cch6cthlpytah8dkhh8psju4xetx84s',
      terraswapPair: 'unused',
    });
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
                {/* SnackbarContainer */}
                <SnackbarContainer />
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
