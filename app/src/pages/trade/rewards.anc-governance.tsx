import { anc80gif, GifIcon } from '@anchor-protocol/token-icons';
import { RulerTab } from '@terra-dev/neumorphism-ui/components/RulerTab';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { Circles } from 'components/Circles';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { screen } from 'env';
import { AncGovernanceStake } from 'pages/trade/components/AncGovernanceStake';
import { AncGovernanceUnstake } from 'pages/trade/components/AncGovernanceUnstake';
import { ancGovernancePathname } from 'pages/trade/env';
import React, { ReactNode, useCallback, useMemo } from 'react';
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
  tooltip: ReactNode;
}

const stakeItems: Item[] = [
  { label: 'Stake', value: 'stake', tooltip: '' },
  { label: 'Unstake', value: 'unstake', tooltip: '' },
];

function RewardsAncUstLpBase({ className }: RewardsAncUstLpProps) {
  const history = useHistory();

  const pageMatch = useRouteMatch<{ view: string }>(
    `/${ancGovernancePathname}/:view`,
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
        pathname: `/${ancGovernancePathname}/${nextTab.value}`,
      });
    },
    [history],
  );

  return (
    <CenteredLayout className={className}>
      <header>
        <h1>
          <Circles radius={24} backgroundColors={['#2C2C2C']}>
            <GifIcon
              src={anc80gif}
              style={{ fontSize: '2em', borderRadius: '50%' }}
            />
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
          tooltipFunction={({ tooltip }) => tooltip}
        />

        <div className="form">
          <Switch>
            <Route
              path={`/${ancGovernancePathname}/stake`}
              component={AncGovernanceStake}
            />
            <Route
              path={`/${ancGovernancePathname}/unstake`}
              component={AncGovernanceUnstake}
            />
            <Redirect
              exact
              path={`/${ancGovernancePathname}`}
              to={`/${ancGovernancePathname}/stake`}
            />
            <Redirect
              path={`/${ancGovernancePathname}/*`}
              to={`/${ancGovernancePathname}/stake`}
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

      word-break: keep-all;
      white-space: nowrap;

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

  // under tablet
  @media (max-width: ${screen.tablet.max}px) {
    header {
      h1 {
        font-size: 32px;
      }

      margin-bottom: 20px;
    }
  }
`;
