import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
import { Footer } from 'components/Footer';
import { screen } from 'env';
import { useCallback, useMemo } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';
import { Burn } from './burn';
import { Claim } from './claim';
import { Mint } from './mint';

export interface BAssetProps extends RouteComponentProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
  tooltip: string;
}

const tabItems: Item[] = [
  { label: 'MINT', value: 'mint', tooltip: 'Bond assets to mint bAssets' },
  {
    label: 'BURN',
    value: 'burn',
    tooltip: 'Burn previously minted bAssets to unbond your assets',
  },
  {
    label: 'CLAIM',
    value: 'claim',
    tooltip: 'Claim burned bAssets or Staking Rewards',
  },
];

function BAssetBase({ className, match, history }: BAssetProps) {
  const pageMatch = useRouteMatch<{ page: string }>(`${match.path}/:page`);

  const tab = useMemo<Item | undefined>(() => {
    return tabItems.find(({ value }) => value === pageMatch?.params.page);
  }, [pageMatch?.params.page]);

  const tabChange = useCallback(
    (nextTab: Item) => {
      history.push({
        pathname: `${match.path}/${nextTab.value}`,
      });
    },
    [history, match.path],
  );

  return (
    <div className={className}>
      <main>
        <div className="content-layout">
          <Tab
            className="tab"
            items={tabItems}
            selectedItem={tab ?? tabItems[0]}
            onChange={tabChange}
            labelFunction={({ label }) => label}
            keyFunction={({ value }) => value}
            tooltipFunction={({ tooltip }) => tooltip}
          />

          <Switch>
            <Redirect exact path={`${match.path}/`} to={`${match.path}/mint`} />
            <Route path={`${match.path}/mint`} component={Mint} />
            <Route path={`${match.path}/burn`} component={Burn} />
            <Route path={`${match.path}/claim`} component={Claim} />
            <Redirect path={`${match.path}/*`} to={`${match.path}/mint`} />
          </Switch>
        </div>

        <Footer style={{ margin: '60px 40px' }} />
      </main>
    </div>
  );
}

export const BAsset = styled(BAssetBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  h1 {
    font-size: 34px;
    font-weight: 900;
    color: ${({ theme }) => theme.textColor};
  }

  .tab {
    margin-bottom: 40px;
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  main {
    .content-layout {
      max-width: 940px;
      margin: 0 auto;
      padding: 0 20px;
      border-radius: 30px;
    }
  }

  // pc
  @media (min-width: ${screen.pc.min}px) {
    main {
      padding-top: 100px;
    }
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    main {
      padding-top: 30px;
    }

    .NeuSection-root {
      .NeuSection-content {
        padding: 30px;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    main {
      padding-top: 30px;
    }

    .NeuSection-root {
      .NeuSection-content {
        padding: 20px;
      }
    }
  }
`;
