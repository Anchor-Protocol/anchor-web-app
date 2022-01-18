import { useChainOptions } from '@terra-money/wallet-provider';
import { AstroportGuideBanner } from 'components/AstroportGuideBanner';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { AppProviders } from 'configurations/app';
import { NotificationProvider } from 'contexts/notification';
import { JobsProvider } from 'jobs/Jobs';
import { Airdrop } from 'pages/airdrop';
import { BAssetMain } from 'pages/basset/main';
import { Borrow } from 'pages/borrow';
import { Dashboard } from 'pages/dashboard';
import { Earn } from 'pages/earn';
import { GovernanceMain } from 'pages/gov/main';
import { PollCreate } from 'pages/gov/poll.create';
import { PollCreateModifyANCDistribution } from 'pages/gov/poll.create.modify-anc-distribution';
import { PollCreateModifyBorrowInterest } from 'pages/gov/poll.create.modify-borrow-interest';
import { PollCreateModifyCollateralAttribute } from 'pages/gov/poll.create.modify-collateral-attribute';
import { PollCreateModifyMarketParameters } from 'pages/gov/poll.create.modify-market-parameters';
import { PollCreateRegisterCollateralAttributes } from 'pages/gov/poll.create.register-collateral-attributes';
import { PollCreateSpendCommunityPool } from 'pages/gov/poll.create.spend-community-pool';
import { PollCreateTextProposal } from 'pages/gov/poll.create.text-proposal';
import { PollDetail } from 'pages/gov/poll.detail';
import { Mypage } from 'pages/mypage';
import { TermsOfService } from 'pages/terms';
import { ClaimAll } from 'pages/trade/claim.all';
import { ClaimAncUstLp } from 'pages/trade/claim.anc-ust-lp';
import { ClaimUstBorrow } from 'pages/trade/claim.ust-borrow';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  ustBorrowPathname,
} from 'pages/trade/env';
import { RewardsAncGovernance } from 'pages/trade/rewards.anc-governance';
import { RewardsAncUstLp } from 'pages/trade/rewards.anc-ust-lp';
import { Trade } from 'pages/trade/trade';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './configurations/chartjs';

export function TerraApp() {
  const chainOptions = useChainOptions();

  return (
    chainOptions && (
      <AppProviders {...chainOptions}>
        <NotificationProvider>
          <JobsProvider>
            <div>
              <GlobalStyle />
              <Header />
              <AstroportGuideBanner />
              <Switch>
                {/* Dashboard */}
                <Route path="/" exact component={Dashboard} />

                {/* Earn */}
                <Route path="/earn" component={Earn} />

                {/* Borrow */}
                <Route path="/borrow" component={Borrow} />

                {/* Bond */}
                <Route path="/bond" component={BAssetMain} />

                {/* Airdrop */}
                <Route path="/airdrop" component={Airdrop} />

                {/* Governance */}
                <Route exact path={`/gov/`} component={GovernanceMain} />

                {/* Poll */}
                <Route exact path={`/poll/create`} component={PollCreate} />
                <Route
                  path={`/poll/create/modify-anc-distribution`}
                  component={PollCreateModifyANCDistribution}
                />
                <Route
                  path={`/poll/create/modify-borrow-interest`}
                  component={PollCreateModifyBorrowInterest}
                />
                <Route
                  path={`/poll/create/modify-collateral-attribute`}
                  component={PollCreateModifyCollateralAttribute}
                />
                <Route
                  path={`/poll/create/modify-market-parameters`}
                  component={PollCreateModifyMarketParameters}
                />
                <Route
                  path={`/poll/create/spend-community-pool`}
                  component={PollCreateSpendCommunityPool}
                />
                <Route
                  path={`/poll/create/text-proposal`}
                  component={PollCreateTextProposal}
                />
                <Route
                  path={`/poll/create/register-collateral-attributes`}
                  component={PollCreateRegisterCollateralAttributes}
                />
                <Route path={`/poll/:id`} component={PollDetail} />

                {/* Trade */}
                <Route path={`/trade`} component={Trade} />
                <Route
                  path={`/${ancUstLpPathname}`}
                  component={RewardsAncUstLp}
                />
                <Route
                  path={`/${ancGovernancePathname}`}
                  component={RewardsAncGovernance}
                />
                <Route path={`/claim/all`} component={ClaimAll} />
                <Route
                  path={`/claim/${ancUstLpPathname}`}
                  component={ClaimAncUstLp}
                />
                <Route
                  path={`/claim/${ustBorrowPathname}`}
                  component={ClaimUstBorrow}
                />

                {/* Mypage */}
                <Route path="/mypage" component={Mypage} />

                {/* TOS */}
                <Route path="/terms" component={TermsOfService} />

                <Redirect to="/" />
              </Switch>
            </div>
          </JobsProvider>
        </NotificationProvider>
      </AppProviders>
    )
  );
}
