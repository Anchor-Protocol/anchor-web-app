import { PollCreateModifyCollateralAttribute } from 'pages/gov/poll.create.modify-collateral-attribute';
import { Redirect, Route, Switch } from 'react-router-dom';
import { govPathname } from './env';
import { GovernanceMain } from './main';
import { PollCreate } from './poll.create';
import { PollDetail } from './poll.detail';
import { RewardsPool } from './rewards.pool';
import { Trade } from './trade';

export function Governance() {
  return (
    <Switch>
      {/* Main */}
      <Route exact path={`/${govPathname}/`} component={GovernanceMain} />

      {/* Rewards */}
      <Route path={`/${govPathname}/pool/:reward`} component={RewardsPool} />

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
