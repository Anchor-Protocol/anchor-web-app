import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { EvmAppProviders } from 'configurations/evm';
import React from 'react';
import './configurations/chartjs';

export function EvmApp() {
  return (
    <EvmAppProviders>
      <div>
        EVM
        <GlobalStyle />
        <Header />
        {/* <Switch>
          <Route path="/" exact component={Dashboard} />
          <Redirect to="/" />
        </Switch> */}
      </div>
    </EvmAppProviders>
  );
}
