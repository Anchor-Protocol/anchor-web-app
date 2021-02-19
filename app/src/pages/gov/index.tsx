import { pollCreateTextProposal } from 'pages/gov/poll.create.text-proposal';
import { Redirect, Route, Switch } from 'react-router-dom';
import { govPathname } from './env';
import { GovernmentMain } from './main';
import { PollCreate } from './poll.create';
import { PollDetail } from './poll.detail';
import { RewardsClaim } from './rewards.claim';
import { RewardsPool } from './rewards.pool';
import { RewardsStake } from './rewards.stake';

export function Government() {
  return (
    <Switch>
      <Route exact path={`/${govPathname}/`} component={GovernmentMain} />

      {/* Rewards */}
      <Route path={`/${govPathname}/rewards/pool`} component={RewardsPool} />
      <Route path={`/${govPathname}/rewards/stake`} component={RewardsStake} />
      <Route path={`/${govPathname}/rewards/claim`} component={RewardsClaim} />

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
