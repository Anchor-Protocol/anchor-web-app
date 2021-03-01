import { AnchorNoCircle } from '@anchor-protocol/icons';
import { RulerTab } from '@anchor-protocol/neumorphism-ui/components/RulerTab';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Circles } from 'components/Circles';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { AncGovernanceClaim } from 'pages/gov/components/AncGovernanceClaim';
import { AncGovernanceStake } from 'pages/gov/components/AncGovernanceStake';
import { AncGovernanceUnstake } from 'pages/gov/components/AncGovernanceUnstake';
import { ancGovernancePathname, govPathname } from 'pages/gov/env';
import React, { useCallback, useMemo } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';

export interface RewardsAncUstLpProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const tabItems: Item[] = [
  { label: 'STAKE', value: 'stake' },
  { label: 'CLAIM', value: 'claim' },
];

const stakeItems: Item[] = [
  { label: 'Stake', value: 'stake' },
  { label: 'Unstake', value: 'unstake' },
];

const claimItems: Item[] = [{ label: 'Claim', value: 'claim' }];

function RewardsAncUstLpBase({ className }: RewardsAncUstLpProps) {
  const history = useHistory();

  const pageMatch = useRouteMatch<{ view: string }>(
    `/${govPathname}/rewards/${ancGovernancePathname}/:view`,
  );

  const tab = useMemo<Item | undefined>(() => {
    switch (pageMatch?.params.view) {
      case 'stake':
      case 'unstake':
        return tabItems[0];
      case 'claim':
        return tabItems[1];
    }
  }, [pageMatch?.params.view]);

  const tabChange = useCallback(
    (nextTab: Item) => {
      history.push({
        pathname:
          nextTab.value === 'stake'
            ? `/${govPathname}/rewards/${ancGovernancePathname}/stake`
            : `/${govPathname}/rewards/${ancGovernancePathname}/claim`,
      });
    },
    [history],
  );

  const subTab = useMemo<Item | undefined>(() => {
    switch (pageMatch?.params.view) {
      case 'stake':
        return stakeItems[0];
      case 'unstake':
        return stakeItems[1];
      case 'claim':
        return claimItems[0];
    }
  }, [pageMatch?.params.view]);

  const subTabChange = useCallback(
    (nextTab: Item) => {
      history.push({
        pathname: `/${govPathname}/rewards/${ancGovernancePathname}/${nextTab.value}`,
      });
    },
    [history],
  );

  return (
    <CenteredLayout className={className}>
      <header>
        <h1>
          <Circles radius={24} backgroundColor="#ffffff">
            <TokenIcon
              token="ust"
              variant="@3x"
              style={{ fontSize: '1.1em' }}
            />
            <AnchorNoCircle style={{ fontSize: '1.4em' }} />
          </Circles>
          ANC Governance
        </h1>
        <Tab
          items={tabItems}
          selectedItem={tab ?? tabItems[0]}
          onChange={tabChange}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}
          height={46}
          borderRadius={30}
          fontSize={12}
        />
      </header>

      <Section>
        <RulerTab
          className="subtab"
          items={tab?.value === 'stake' ? stakeItems : claimItems}
          selectedItem={
            subTab ?? (tab?.value === 'stake' ? stakeItems[0] : claimItems[0])
          }
          onChange={subTabChange}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}
        />

        <Switch>
          <Route
            path={`/${govPathname}/rewards/${ancGovernancePathname}/stake`}
            component={AncGovernanceStake}
          />
          <Route
            path={`/${govPathname}/rewards/${ancGovernancePathname}/unstake`}
            component={AncGovernanceUnstake}
          />
          <Route
            path={`/${govPathname}/rewards/${ancGovernancePathname}/claim`}
            component={AncGovernanceClaim}
          />
          <Redirect
            exact
            path={`/${govPathname}/rewards/${ancGovernancePathname}`}
            to={`/${govPathname}/rewards/${ancGovernancePathname}/stake`}
          />
          <Redirect
            path={`/${govPathname}/rewards/${ancGovernancePathname}/*`}
            to={`/${govPathname}/rewards/${ancGovernancePathname}/stake`}
          />
        </Switch>
      </Section>
    </CenteredLayout>
  );
}

export const RewardsAncGovernance = styled(RewardsAncUstLpBase)`
  header {
    display: grid;
    grid-template-columns: 1fr 250px;
    align-items: center;

    margin-bottom: 40px;

    h1 {
      font-size: 44px;
      font-weight: 900;
      display: flex;
      align-items: center;

      > :first-child {
        margin-right: 14px;
      }
    }
  }

  .subtab {
    margin-bottom: 70px;
  }
`;
