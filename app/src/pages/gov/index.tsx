import { pollCreateTextProposal } from 'pages/gov/poll.create.text-proposal';
import { RewardsPool } from 'pages/gov/rewards.pool';
import { Redirect, Route, Switch } from 'react-router-dom';
import { govPathname } from './env';
import { GovernmentMain } from './main';
import { PollCreate } from './poll.create';
import { PollDetail } from './poll.detail';

export function Government() {
  return (
    <Switch>
      {/* Main */}
      <Route exact path={`/${govPathname}/`} component={GovernmentMain} />

      {/* Rewards */}
      <Route path={`/${govPathname}/pool/:reward`} component={RewardsPool} />

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
