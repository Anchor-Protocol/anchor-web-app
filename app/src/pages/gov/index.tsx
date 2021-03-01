import { PollCreateModifyCollateralAttribute } from 'pages/gov/poll.create.modify-collateral-attribute';
import { RewardsAncGovernance } from 'pages/gov/rewards.anc-governance';
import { RewardsAncUstLp } from 'pages/gov/rewards.anc-ust-lp';
import { RewardsUstBorrow } from 'pages/gov/rewards.ust-borrow';
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

      <Route
        path={`/${govPathname}/rewards/${ustBorrowPathname}`}
        component={RewardsUstBorrow}
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
        path={`/${govPathname}/poll/create/modify-collateral-attribute`}
        component={PollCreateModifyCollateralAttribute}
      />

      <Route path={`/${govPathname}/poll/:id`} component={PollDetail} />

      {/* Fallback */}
      <Redirect path={`/${govPathname}/*`} to={`/${govPathname}/`} />
    </Switch>
  );
}
