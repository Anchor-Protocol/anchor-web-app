import { useCloudflareAnalytics } from '@terra-dev/use-cloudflare-analytics';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { AppProviders } from 'configurations/AppProviders';
import { NotificationProvider } from 'contexts/notification';
import { JobsProvider } from 'jobs/Jobs';
import { Airdrop } from 'pages/airdrop';
import { BAsset } from 'pages/basset';
import { Borrow } from 'pages/borrow';
import { Dashboard } from 'pages/dashboard';
import { Earn } from 'pages/earn';
import { ClaimAll } from 'pages/gov/claim.all';
import { ClaimAncUstLp } from 'pages/gov/claim.anc-ust-lp';
import { ClaimUstBorrow } from 'pages/gov/claim.ust-borrow';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  ustBorrowPathname,
} from 'pages/gov/env';
import { GovernanceMain } from 'pages/gov/main';
import { PollCreate } from 'pages/gov/poll.create';
import { PollCreateModifyANCDistribution } from 'pages/gov/poll.create.modify-anc-distribution';
import { PollCreateModifyBorrowInterest } from 'pages/gov/poll.create.modify-borrow-interest';
import { PollCreateModifyCollateralAttribute } from 'pages/gov/poll.create.modify-collateral-attribute';
import { PollCreateModifyMarketParameters } from 'pages/gov/poll.create.modify-market-parameters';
import { PollCreateSpendCommunityPool } from 'pages/gov/poll.create.spend-community-pool';
import { PollCreateTextProposal } from 'pages/gov/poll.create.text-proposal';
import { PollDetail } from 'pages/gov/poll.detail';
import { RewardsAncGovernance } from 'pages/gov/rewards.anc-governance';
import { RewardsAncUstLp } from 'pages/gov/rewards.anc-ust-lp';
import { Trade } from 'pages/gov/trade';
import { Mypage } from 'pages/mypage';
import { Redirect, Route, Switch } from 'react-router-dom';
import './configurations/chartjs';
import { cloudFlareOption } from 'env';

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
              {/* Dashboard */}
              <Route path="/" exact component={Dashboard} />

              {/* Earn */}
              <Route path="/earn" component={Earn} />

              {/* Borrow */}
              <Route path="/borrow" component={Borrow} />

              {/* Bond */}
              <Route path="/bond" component={BAsset} />

              {/* Airdrop */}
              <Route path="/airdrop" component={Airdrop} />

              {/* Governance */}
              <Route exact path={`/gov/`} component={GovernanceMain} />
              <Route path={`/gov/trade`} component={Trade} />
              <Route exact path={`/gov/poll/create`} component={PollCreate} />
              <Route
                path={`/gov/poll/create/modify-anc-distribution`}
                component={PollCreateModifyANCDistribution}
              />
              <Route
                path={`/gov/poll/create/modify-borrow-interest`}
                component={PollCreateModifyBorrowInterest}
              />
              <Route
                path={`/gov/poll/create/modify-collateral-attribute`}
                component={PollCreateModifyCollateralAttribute}
              />
              <Route
                path={`/gov/poll/create/modify-market-parameters`}
                component={PollCreateModifyMarketParameters}
              />
              <Route
                path={`/gov/poll/create/spend-community-pool`}
                component={PollCreateSpendCommunityPool}
              />
              <Route
                path={`/gov/poll/create/text-proposal`}
                component={PollCreateTextProposal}
              />
              <Route path={`/gov/poll/:id`} component={PollDetail} />

              {/* Rewards */}
              <Route
                path={`/gov/rewards/${ancUstLpPathname}`}
                component={RewardsAncUstLp}
              />
              <Route
                path={`/gov/rewards/${ancGovernancePathname}`}
                component={RewardsAncGovernance}
              />
              <Route path={`/gov/claim/all`} component={ClaimAll} />
              <Route
                path={`/gov/claim/${ancUstLpPathname}`}
                component={ClaimAncUstLp}
              />
              <Route
                path={`/gov/claim/${ustBorrowPathname}`}
                component={ClaimUstBorrow}
              />
              <Redirect path={`/gov/*`} to={`/gov/`} />
              <Route path="/mypage" component={Mypage} />

              <Redirect to="/" />
            </Switch>
          </div>
        </JobsProvider>
      </NotificationProvider>
    </AppProviders>
  );
}
