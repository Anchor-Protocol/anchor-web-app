import { ClaimAll } from 'pages/gov/claim.all';
import { ClaimAncUstLp } from 'pages/gov/claim.anc-ust-lp';
import { ClaimUstBorrow } from 'pages/gov/claim.ust-borrow';
import { PollCreateModifyANCDistribution } from 'pages/gov/poll.create.modify-anc-distribution';
import { PollCreateModifyBorrowInterest } from 'pages/gov/poll.create.modify-borrow-interest';
import { PollCreateModifyCollateralAttribute } from 'pages/gov/poll.create.modify-collateral-attribute';
import { PollCreateModifyMarketParameters } from 'pages/gov/poll.create.modify-market-parameters';
import { RewardsAncGovernance } from 'pages/gov/rewards.anc-governance';
import { RewardsAncUstLp } from 'pages/gov/rewards.anc-ust-lp';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  govPathname,
  ustBorrowPathname,
} from './env';
import { GovernanceMain } from './main';
import { PollCreate } from './poll.create';
import { PollDetail } from './poll.detail';
import { Trade } from './trade';

export function Governance() {
  return (
    <Switch>
      {/* Main */}
      <Route exact path={`/${govPathname}/`} component={GovernanceMain} />

      {/* Rewards */}
      <Route
        path={`/${govPathname}/rewards/${ancUstLpPathname}`}
        component={RewardsAncUstLp}
      />

      <Route
        path={`/${govPathname}/rewards/${ancGovernancePathname}`}
        component={RewardsAncGovernance}
      />

      {/* Claim */}
      <Route path={`/${govPathname}/claim/all`} component={ClaimAll} />

      <Route
        path={`/${govPathname}/claim/${ancUstLpPathname}`}
        component={ClaimAncUstLp}
      />

      <Route
        path={`/${govPathname}/claim/${ustBorrowPathname}`}
        component={ClaimUstBorrow}
      />

      {/* Trade */}
      <Route path={`/${govPathname}/trade`} component={Trade} />

      {/* Poll */}
      <Route
        exact
        path={`/${govPathname}/poll/create`}
        component={PollCreate}
      />

      <Route
        path={`/${govPathname}/poll/create/modify-anc-distribution`}
        component={PollCreateModifyANCDistribution}
      />

      <Route
        path={`/${govPathname}/poll/create/modify-borrow-interest`}
        component={PollCreateModifyBorrowInterest}
      />

      <Route
        path={`/${govPathname}/poll/create/modify-collateral-attribute`}
        component={PollCreateModifyCollateralAttribute}
      />

      <Route
        path={`/${govPathname}/poll/create/modify-market-parameters`}
        component={PollCreateModifyMarketParameters}
      />

      <Route path={`/${govPathname}/poll/:id`} component={PollDetail} />

      {/* Fallback */}
      <Redirect path={`/${govPathname}/*`} to={`/${govPathname}/`} />
    </Switch>
  );
}
