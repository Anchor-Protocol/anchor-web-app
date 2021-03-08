import { AnchorNoCircle } from '@anchor-protocol/icons';
import { RulerTab } from '@anchor-protocol/neumorphism-ui/components/RulerTab';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Circles } from 'components/Circles';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { AncUstLpProvide } from 'pages/gov/components/AncUstLpProvide';
import { AncUstLpStake } from 'pages/gov/components/AncUstLpStake';
import { AncUstLpUnstake } from 'pages/gov/components/AncUstLpUnstake';
import { AncUstLpWithdraw } from 'pages/gov/components/AncUstLpWithdraw';
import { ancUstLpPathname, govPathname } from 'pages/gov/env';
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

function RewardsAncUstLpBase({ className }: RewardsAncUstLpProps) {
  const history = useHistory();

  const pageMatch = useRouteMatch<{ view: string }>(
    `/${govPathname}/rewards/${ancUstLpPathname}/:view`,
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
            ? `/${govPathname}/rewards/${ancUstLpPathname}/stake`
            : `/${govPathname}/rewards/${ancUstLpPathname}/provide`,
      });
    },
    [history],
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
        pathname: `/${govPathname}/rewards/${ancUstLpPathname}/${nextTab.value}`,
      });
    },
    [history],
  );

  return (
    <CenteredLayout className={className}>
      <header>
        <h1>
          <Circles radius={24} backgroundColors={['#ffffff', '#2C2C2C']}>
            <TokenIcon token="ust" style={{ fontSize: '1.1em' }} />
            <AnchorNoCircle style={{ fontSize: '1.4em' }} />
          </Circles>
          ANC-UST LP
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

        <div className="form">
          <Switch>
            <Route
              path={`/${govPathname}/rewards/${ancUstLpPathname}/provide`}
              component={AncUstLpProvide}
            />
            <Route
              path={`/${govPathname}/rewards/${ancUstLpPathname}/withdraw`}
              component={AncUstLpWithdraw}
            />
            <Route
              path={`/${govPathname}/rewards/${ancUstLpPathname}/stake`}
              component={AncUstLpStake}
            />
            <Route
              path={`/${govPathname}/rewards/${ancUstLpPathname}/unstake`}
              component={AncUstLpUnstake}
            />
            <Redirect
              exact
              path={`/${govPathname}/rewards/${ancUstLpPathname}`}
              to={`/${govPathname}/rewards/${ancUstLpPathname}/provide`}
            />
            <Redirect
              path={`/${govPathname}/rewards/${ancUstLpPathname}/*`}
              to={`/${govPathname}/rewards/${ancUstLpPathname}/provide`}
            />
          </Switch>
        </div>
      </Section>
    </CenteredLayout>
  );
}

export const RewardsAncUstLp = styled(RewardsAncUstLpBase)`
  header {
    display: grid;
    grid-template-columns: 1fr 375px;
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

  .form {
    .description {
      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 16px;
      color: ${({ theme }) => theme.dimTextColor};

      > :last-child {
        font-size: 12px;
      }

      margin-bottom: 12px;
    }

    .amount {
      width: 100%;

      margin-bottom: 5px;
    }

    .wallet {
      display: flex;
      justify-content: space-between;

      font-size: 12px;
      color: ${({ theme }) => theme.dimTextColor};

      &[aria-invalid='true'] {
        color: ${({ theme }) => theme.colors.negative};
      }
    }

    .separator {
      margin: 10px 0 0 0;
    }

    .receipt {
      margin-top: 30px;
    }

    .submit {
      margin-top: 40px;

      width: 100%;
      height: 60px;
    }
  }
`;
