import { AnchorNoCircle } from '@anchor-protocol/icons';
import { RulerTab } from '@anchor-protocol/neumorphism-ui/components/RulerTab';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Circles } from 'components/Circles';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
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

const stakeItems: Item[] = [
  { label: 'Stake', value: 'stake' },
  { label: 'Unstake', value: 'unstake' },
];

function RewardsAncUstLpBase({ className }: RewardsAncUstLpProps) {
  const history = useHistory();

  const pageMatch = useRouteMatch<{ view: string }>(
    `/${govPathname}/rewards/${ancGovernancePathname}/:view`,
  );

  const subTab = useMemo<Item | undefined>(() => {
    switch (pageMatch?.params.view) {
      case 'stake':
        return stakeItems[0];
      case 'unstake':
        return stakeItems[1];
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
      </header>

      <Section>
        <RulerTab
          className="subtab"
          items={stakeItems}
          selectedItem={subTab ?? stakeItems[0]}
          onChange={subTabChange}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}
        />

        <div className="form">
          <Switch>
            <Route
              path={`/${govPathname}/rewards/${ancGovernancePathname}/stake`}
              component={AncGovernanceStake}
            />
            <Route
              path={`/${govPathname}/rewards/${ancGovernancePathname}/unstake`}
              component={AncGovernanceUnstake}
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
        </div>
      </Section>
    </CenteredLayout>
  );
}

export const RewardsAncGovernance = styled(RewardsAncUstLpBase)`
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
        color: #f5356a;
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
