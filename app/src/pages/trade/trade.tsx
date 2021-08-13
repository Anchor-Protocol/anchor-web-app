import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { Tab } from '@terra-dev/neumorphism-ui/components/Tab';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { TradeBuy } from 'pages/trade/components/TradeBuy';
import { TradeSell } from 'pages/trade/components/TradeSell';
import React, { ReactNode, useCallback, useMemo } from 'react';
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
  tooltip: ReactNode;
}

const tabItems: Item[] = [
  {
    label: 'BUY',
    value: 'buy',
    tooltip:
      'The amount of asset traded is automatically calculated based on the current price, spread, and commission',
  },
  {
    label: 'SELL',
    value: 'sell',
    tooltip:
      'The amount of asset traded is automatically calculated based on the current price, spread, and commission',
  },
];

function TradeBase({ className }: RewardsPoolProps) {
  const history = useHistory();

  const pageMatch = useRouteMatch<{ view: string }>(`/trade/:view`);

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
        pathname: nextTab.value === 'sell' ? `/trade/sell` : `/trade/buy`,
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
        tooltipFunction={({ tooltip }) => tooltip}
      />

      <Section>
        <Switch>
          <Route path={`/trade/buy`} component={TradeBuy} />
          <Route path={`/trade/sell`} component={TradeSell} />
          <Redirect exact path={`/trade`} to={`/trade/buy`} />
          <Redirect path={`/trade/*`} to={`/trade/buy`} />
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
