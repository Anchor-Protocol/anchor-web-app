import { RewardsClaim } from './rewards.claim';
import { RewardsPool } from './rewards.pool';
import { RewardsStake } from './rewards.stake';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { GovernmentMain } from './main';

export function Government({ match }: RouteComponentProps) {
  return (
    <Switch>
      <Route exact path={`${match.path}/`} component={GovernmentMain} />
      <Route
        exact
        path={`${match.path}/rewards/pool`}
        component={RewardsPool}
      />
      <Route
        exact
        path={`${match.path}/rewards/stake`}
        component={RewardsStake}
      />
      <Route
        exact
        path={`${match.path}/rewards/claim`}
        component={RewardsClaim}
      />
      <Redirect path={`${match.path}/*`} to={`${match.path}/`} />
    </Switch>
  );
}
