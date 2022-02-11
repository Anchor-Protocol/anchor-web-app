import React from 'react';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { Dashboard } from 'pages/dashboard';
import { Redirect, Route, Switch } from 'react-router-dom';
import { EvmAppProviders } from 'providers/evm/EvmAppProviders';
import { Earn } from 'pages/earn';
import { TermsOfService } from 'pages/terms';
import { Mypage } from 'pages/mypage';
import '../../configurations/chartjs';

export function EvmApp() {
  return (
    <EvmAppProviders>
      <div>
        <GlobalStyle />
        <Header />
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/earn" component={Earn} />
          <Route path="/mypage" component={Mypage} />
          <Route path="/terms" component={TermsOfService} />
          <Redirect to="/" />
        </Switch>
      </div>
    </EvmAppProviders>
  );
}
