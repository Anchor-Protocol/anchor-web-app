import React from 'react'
import logo from './logo.svg'
import './App.css'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import Routes from './routes'
import DefaultLayout from './layout/default-layout'
import { useWalletState, WalletProvider } from './hooks/use-wallet'

const RoutedApp: React.FunctionComponent = ({ children }) => {
  const location = useLocation()
  const wallet = useWalletState()

  return (
    <WalletProvider value={wallet} key={wallet.address}>
      <DefaultLayout currentRoute={location.pathname}>
        {children}
      </DefaultLayout>
    </WalletProvider>
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
