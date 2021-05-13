import { LandingProviders } from 'base/AppProviders';
import { Header } from 'components/Header';
import { Index } from 'pages/index';
import { Market as MarketNew } from 'pages/market-new';
import { Market } from 'pages/market-simple';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Redirect, Route, Switch } from 'react-router-dom';

const queryClient = new QueryClient();

export function App() {
  return (
    <LandingProviders>
      <QueryClientProvider client={queryClient}>
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
            <Route path="/dashboard-new" component={MarketNew} />
            <Redirect to="/" />
          </Switch>
        </div>
      </QueryClientProvider>
    </LandingProviders>
  );
}
