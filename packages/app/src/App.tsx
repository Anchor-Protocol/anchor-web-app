import React from 'react'
import logo from './logo.svg'
import './App.css'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import Routes from './routes'
import DefaultLayout from './layout/default-layout'
import { useWalletState, WalletProvider } from './hooks/use-wallet'
import { AddressProviderProvider as ContractAddressProvider } from './providers/address-provider'
import { AddressProviderFromEnvVar } from './anchor-js/address-provider'
import { NetworkProvider } from './providers/network'
import { useNetworkState } from './hooks/use-network'

const RoutedApp: React.FunctionComponent = ({ children }) => {
  const location = useLocation()
  const wallet = useWalletState()

  const network = useNetworkState()

  return (
    <ContractAddressProvider value={new AddressProviderFromEnvVar()}>
      <NetworkProvider value={network} key={network.key}>
        <WalletProvider value={wallet} key={wallet.address}>
          <DefaultLayout currentRoute={location.pathname}>
            {children}
          </DefaultLayout>
        </WalletProvider>
      </NetworkProvider>
    </ContractAddressProvider>
  )
}

function App() {
  return (
    <Router>
      <RoutedApp>
        <Routes />
      </RoutedApp>
    </Router>
  )
}

export default App
