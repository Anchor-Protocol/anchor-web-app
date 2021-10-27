import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { SolanaAppProviders } from 'configurations/app';
import { Earn } from 'pages/earn';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './configurations/chartjs';

export function App() {
  return (
    <SolanaAppProviders>
      {/* <NotificationProvider> */}
      {/* <JobsProvider> */}
      <div>
        <GlobalStyle />
        <Header />
        <Switch>
          <Route path="/" exact component={Earn} />

          <Redirect to="/" />
        </Switch>
      </div>
      {/* </JobsProvider> */}
      {/* </NotificationProvider> */}
    </SolanaAppProviders>
  );
}
