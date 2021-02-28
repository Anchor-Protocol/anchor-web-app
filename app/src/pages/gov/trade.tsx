import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { TradeBuy } from 'pages/gov/components/TradeBuy';
import { TradeSell } from 'pages/gov/components/TradeSell';
import { govPathname } from 'pages/gov/env';
import React, { useCallback, useMemo } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';

export interface RewardsPoolProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const tabItems: Item[] = [
  { label: 'BUY', value: 'buy' },
  { label: 'SELL', value: 'sell' },
];

function TradeBase({ className }: RewardsPoolProps) {
  const history = useHistory();

  const pageMatch = useRouteMatch<{ view: string }>(
    `/${govPathname}/trade/:view`,
  );

  const tab = useMemo<Item | undefined>(() => {
    switch (pageMatch?.params.view) {
      case 'buy':
        return tabItems[0];
      case 'sell':
        return tabItems[1];
    }
  }, [pageMatch?.params.view]);

  const tabChange = useCallback(
    (nextTab: Item) => {
      history.push({
        pathname:
          nextTab.value === 'sell'
            ? `/${govPathname}/trade/sell`
            : `/${govPathname}/trade/buy`,
      });
    },
    [history],
  );

  return (
    <CenteredLayout className={className}>
      <Tab
        className="tab"
        items={tabItems}
        selectedItem={tab ?? tabItems[0]}
        onChange={tabChange}
        labelFunction={({ label }) => label}
        keyFunction={({ value }) => value}
      />

      <Section>
        <Switch>
          <Route path={`/${govPathname}/trade/buy`} component={TradeBuy} />
          <Route path={`/${govPathname}/trade/sell`} component={TradeSell} />
          <Redirect
            exact
            path={`/${govPathname}/trade`}
            to={`/${govPathname}/trade/buy`}
          />
          <Redirect
            path={`/${govPathname}/trade/*`}
            to={`/${govPathname}/trade/buy`}
          />
        </Switch>
      </Section>
    </CenteredLayout>
  );
}

export const Trade = styled(TradeBase)`
  .tab {
    margin-bottom: 40px;
  }

  .burn-description,
  .gett-description {
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

  .burn,
  .gett {
    margin-bottom: 30px;
  }

  hr {
    margin: 40px 0;
  }

  .validator {
    width: 100%;
    margin-bottom: 40px;

    &[data-selected-value=''] {
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .receipt {
    margin-bottom: 40px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
