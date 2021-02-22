import { AnchorNoCircle } from '@anchor-protocol/icons';
import { RulerTab } from '@anchor-protocol/neumorphism-ui/components/RulerTab';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Circles } from 'components/Circles';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { PoolProvide } from 'pages/gov/components/PoolProvide';
import { PoolStake } from 'pages/gov/components/PoolStake';
import { PoolUnstake } from 'pages/gov/components/PoolUnstake';
import { PoolWithdraw } from 'pages/gov/components/PoolWithdraw';
import { govPathname } from 'pages/gov/env';
import React, { useCallback, useMemo } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

export interface RewardsPoolProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const tabItems: Item[] = [
  { label: 'POOL', value: 'pool' },
  { label: 'STAKE', value: 'stake' },
];

const poolItems: Item[] = [
  { label: 'Provide', value: 'provide' },
  { label: 'Withdraw', value: 'withdraw' },
];

const stakeItems: Item[] = [
  { label: 'Stake', value: 'stake' },
  { label: 'Unstake', value: 'unstake' },
];

function RewardsPoolBase({ className }: RewardsPoolProps) {
  const history = useHistory();

  const pageMatch = useRouteMatch<{ reward: string; view: string }>(
    `/${govPathname}/pool/:reward/:view`,
  );

  const tab = useMemo<Item | undefined>(() => {
    switch (pageMatch?.params.view) {
      case 'provide':
      case 'withdraw':
        return tabItems[0];
      case 'stake':
      case 'unstake':
        return tabItems[1];
    }
  }, [pageMatch?.params.view]);

  const tabChange = useCallback(
    (nextTab: Item) => {
      history.push({
        pathname:
          nextTab.value === 'stake'
            ? `/${govPathname}/pool/${pageMatch?.params.reward}/stake`
            : `/${govPathname}/pool/${pageMatch?.params.reward}/provide`,
      });
    },
    [history, pageMatch?.params.reward],
  );

  const subTab = useMemo<Item | undefined>(() => {
    switch (pageMatch?.params.view) {
      case 'provide':
        return poolItems[0];
      case 'withdraw':
        return poolItems[1];
      case 'stake':
        return stakeItems[0];
      case 'unstake':
        return stakeItems[1];
    }
  }, [pageMatch?.params.view]);

  const subTabChange = useCallback(
    (nextTab: Item) => {
      history.push({
        pathname: `/${govPathname}/pool/${pageMatch?.params.reward}/${nextTab.value}`,
      });
    },
    [history, pageMatch?.params.reward],
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
          {pageMatch?.params.reward}
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
          items={tab?.value === 'stake' ? stakeItems : poolItems}
          selectedItem={
            subTab ?? (tab?.value === 'stake' ? stakeItems[0] : poolItems[0])
          }
          onChange={subTabChange}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}
        />

        <Switch>
          <Route
            path={`/${govPathname}/pool/:reward/provide`}
            component={PoolProvide}
          />
          <Route
            path={`/${govPathname}/pool/:reward/withdraw`}
            component={PoolWithdraw}
          />
          <Route
            path={`/${govPathname}/pool/:reward/stake`}
            component={PoolStake}
          />
          <Route
            path={`/${govPathname}/pool/:reward/unstake`}
            component={PoolUnstake}
          />
        </Switch>
      </Section>
    </CenteredLayout>
  );
}

export const RewardsPool = styled(RewardsPoolBase)`
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
