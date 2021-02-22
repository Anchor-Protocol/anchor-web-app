import { Redirect, Route, Switch } from 'react-router-dom';
import { govPathname } from './env';
import { GovernmentMain } from './main';
import { PollCreate } from './poll.create';
import { pollCreateTextProposal } from './poll.create.text-proposal';
import { PollDetail } from './poll.detail';
import { RewardsPool } from './rewards.pool';
import { Trade } from './trade';

export function Government() {
  return (
    <Switch>
      {/* Main */}
      <Route exact path={`/${govPathname}/`} component={GovernmentMain} />

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
        path={`/${govPathname}/poll/create/text-proposal`}
        component={pollCreateTextProposal}
      />

      <Route path={`/${govPathname}/poll/:id`} component={PollDetail} />

      {/* Fallback */}
      <Redirect path={`/${govPathname}/*`} to={`/${govPathname}/`} />
    </Switch>
  );
}
