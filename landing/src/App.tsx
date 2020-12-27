import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { lightTheme } from '@anchor-protocol/neumorphism-ui/themes/lightTheme';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { BAssets } from 'pages/bassets';
import { Contact } from 'pages/contact';
import { Index } from 'pages/index';
import { Market } from 'pages/market';
import { StableCoins } from 'pages/stablecoins';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import styled from 'styled-components';

export interface AppProps {
  className?: string;
}

function AppBase({ className }: AppProps) {
  return (
    <Router>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        {/* Start Layout */}
        <div className={className}>
          <Header />
          <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/market" component={Market} />
            <Redirect exact path="/stablecoins" to="/market" />
            <Route path="/stablecoins/:coin" component={StableCoins} />
            <Redirect exact path="/bassets" to="/market" />
            <Route path="/bassets/:asset" component={BAssets} />
            <Route path="/contact" component={Contact} />
            <Redirect to="/" />
          </Switch>
          <Footer />
        </div>
        {/* End Layout */}
      </ThemeProvider>
    </Router>
  );
}

export const App = styled(AppBase)`
  // TODO
`;
