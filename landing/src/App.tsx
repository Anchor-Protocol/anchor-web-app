import { LandingProviders } from 'base/AppProviders';
import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Header } from 'components/Header';
import { Index } from 'pages/index';
import { Market as MarketNew } from 'pages/market-new';
import { Market } from 'pages/market-simple';
import { Redirect, Route, Switch } from 'react-router-dom';
import { GlobalStyle } from './components/GlobalStyle';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Filler,
  Legend,
  Title,
  Tooltip,
);

export function App() {
  return (
    <LandingProviders>
      <div>
        <GlobalStyle />
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
    </LandingProviders>
  );
}
