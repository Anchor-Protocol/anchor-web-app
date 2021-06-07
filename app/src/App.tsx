import { useCloudflareAnalytics } from '@terra-dev/use-cloudflare-analytics';
import { AppProviders } from 'base/AppProviders';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { NotificationProvider } from 'contexts/notification';
import { Jobs } from 'jobs/Jobs';
import { Airdrop } from 'pages/airdrop';
import { BAsset } from 'pages/basset';
import { Borrow } from 'pages/borrow';
import { Earn } from 'pages/earn';
import { Governance } from 'pages/gov';
import { govPathname } from 'pages/gov/env';
import { Redirect, Route, Switch } from 'react-router-dom';
import { cloudFlareOption } from './env';

export function App() {
  useCloudflareAnalytics(cloudFlareOption);

  return (
    <AppProviders>
      <NotificationProvider>
        <div>
          <GlobalStyle />
          <Header />
          <Jobs />
          <Switch>
            <Route path="/earn" component={Earn} />
            <Route path="/borrow" component={Borrow} />
            <Route path="/bond" component={BAsset} />
            <Route path="/airdrop" component={Airdrop} />
            <Route path={`/${govPathname}`} component={Governance} />
            <Redirect to="/earn" />
          </Switch>
        </div>
      </NotificationProvider>
    </AppProviders>
  );
}
