import { AppProviders } from '@anchor-protocol/web-contexts/AppProviders';
import { Header } from 'components/Header';
import { Index } from 'pages/index';
import { Market } from 'pages/market-simple';
import { Redirect, Route, Switch } from 'react-router-dom';

export function App() {
  return (
    <AppProviders>
      <div>
        <Header />
        <Switch>
          {/*<Route exact path="/" component={Index} />*/}
          {/*<Route path="/market" component={Market} />*/}
          {/*<Redirect exact path="/stablecoins" to="/market" />*/}
          {/*<Route path="/stablecoins/:stableCoinId" component={StableCoins} />*/}
          {/*<Redirect exact path="/bassets" to="/market" />*/}
          {/*<Route path="/bassets/:bAssetId" component={BAssets} />*/}
          {/*<Route path="/contact" component={Contact} />*/}
          {/*<Redirect to="/" />*/}
          <Route exact path="/" component={Index} />
          <Route path="/dashboard" component={Market} />
          <Redirect to="/" />
        </Switch>
      </div>
    </AppProviders>
  );
}
