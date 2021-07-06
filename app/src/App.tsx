import { useCloudflareAnalytics } from '@terra-dev/use-cloudflare-analytics';
import { AppProviders } from 'base/AppProviders';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { NotificationProvider } from 'contexts/notification';
import { JobsProvider } from 'jobs/Jobs';
import { Airdrop } from 'pages/airdrop';
import { BAsset } from 'pages/basset';
import { Borrow } from 'pages/borrow';
import { Dashboard } from 'pages/dashboard';
import { Earn } from 'pages/earn';
import { Governance } from 'pages/gov';
import { govPathname } from 'pages/gov/env';
import { Mypage } from 'pages/mypage';
import { Redirect, Route, Switch } from 'react-router-dom';
import './configurations/chartjs';
import { cloudFlareOption } from './env';

export function App() {
  useCloudflareAnalytics(cloudFlareOption);

  return (
    <AppProviders>
      <NotificationProvider>
        <JobsProvider>
          <div>
            <GlobalStyle />
            <Header />
            <Switch>
              <Route path="/" exact component={Dashboard} />
              <Route path="/earn" component={Earn} />
              <Route path="/borrow" component={Borrow} />
              <Route path="/bond" component={BAsset} />
              <Route path="/airdrop" component={Airdrop} />
              <Route path={`/${govPathname}`} component={Governance} />
              <Route path="/mypage" component={Mypage} />
              <Redirect to="/" />
            </Switch>
          </div>
        </JobsProvider>
      </NotificationProvider>
    </AppProviders>
  );
}
