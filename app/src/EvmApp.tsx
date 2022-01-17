import React from 'react';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { EvmAppProviders } from 'configurations/evm';
import { Dashboard } from 'pages/dashboard';
import { Redirect, Route, Switch } from 'react-router-dom';
import './configurations/chartjs';

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
