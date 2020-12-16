import React from 'react';
import './App.css';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Routes from './routes';
import DefaultLayout from './layout/default-layout';
import { useWalletState, WalletProvider } from './hooks/use-wallet';
import { AddressProviderProvider as ContractAddressProvider } from './providers/address-provider';
import { AddressProviderFromEnvVar } from '@anchor-protocol/anchor-js/address-provider';
import { mantleConfig, MantleProvider } from './hooks/use-mantle';

const RoutedApp: React.FunctionComponent = ({ children }) => {
  const location = useLocation();
  const wallet = useWalletState();

  return (
    <ContractAddressProvider value={new AddressProviderFromEnvVar()}>
      <WalletProvider value={wallet} key={wallet.address}>
        <MantleProvider client={mantleConfig}>
          <DefaultLayout currentRoute={location.pathname}>
            {children}
          </DefaultLayout>
        </MantleProvider>
      </WalletProvider>
    </ContractAddressProvider>
  );
};

function App() {
  return (
    <Router>
      <RoutedApp>
        <Routes />
      </RoutedApp>
    </Router>
  );
}

export default App;
