import { LandingProviders } from 'base/AppProviders';
import { Header } from 'components/Header';
import { Index } from 'pages/index';
import { Redirect, Route, Switch } from 'react-router-dom';
import { GlobalStyle } from './components/GlobalStyle';

export function App() {
  return (
    <LandingProviders>
      <div>
        <GlobalStyle />
        <Header />
        <Switch>
          <Route exact path="/" component={Index} />
          <Redirect to="/" />
        </Switch>
      </div>
    </LandingProviders>
  );
}
