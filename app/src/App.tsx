import { AppProviders } from '@anchor-protocol/web-contexts/AppProviders';
import { Banner } from 'components/Banner';
import { Header } from 'components/Header';
import { BAsset } from 'pages/basset';
import { Borrow } from 'pages/borrow';
import { Earn } from 'pages/earn';
import { Governance } from 'pages/gov';
import { govPathname } from 'pages/gov/env';
import { Redirect, Route, Switch } from 'react-router-dom';

export function App({ isDemo = false }: { isDemo?: boolean }) {
  return (
    <AppProviders isDemo={isDemo}>
      <div>
        <Header />
        <Banner />
        <Switch>
          <Route path="/earn" component={Earn} />
          <Route path="/borrow" component={Borrow} />
          <Route path="/bond" component={BAsset} />
          {!isDemo && <Route path={`/${govPathname}`} component={Governance} />}
          <Redirect to="/earn" />
        </Switch>
      </div>
    </AppProviders>
  );
}
