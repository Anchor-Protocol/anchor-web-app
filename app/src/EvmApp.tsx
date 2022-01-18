import React from 'react';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { Dashboard } from 'pages/dashboard';
import { Redirect, Route, Switch } from 'react-router-dom';
import './configurations/chartjs';
import { EvmAppProviders } from 'providers/evm/EvmAppProviders';

export function EvmApp() {
  return (
    <EvmAppProviders>
      <div>
        <GlobalStyle />
        <Header />
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Redirect to="/" />
        </Switch>
      </div>
    </EvmAppProviders>
  );
}
