import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
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
import Burn from './burn';
import Claim from './claim';
import { Mint } from './mint';

export interface BAssetProps extends RouteComponentProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const tabItems: Item[] = [
  { label: 'Mint', value: 'mint' },
  { label: 'Burn', value: 'burn' },
  { label: 'Claim', value: 'claim' },
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
        <h1>bASSET</h1>

        <div className="content-layout">
          <Tab
            className="tab"
            items={tabItems}
            selectedItem={tab ?? tabItems[0]}
            onChange={tabChange}
            labelFunction={({ label }) => label}
            keyFunction={({ value }) => value}
          />

          <Switch>
            <Redirect exact path={`${match.path}/`} to={`${match.path}/mint`} />
            <Route path={`${match.path}/mint`} component={Mint} />
            <Route path={`${match.path}/burn`} component={Burn} />
            <Route path={`${match.path}/claim`} component={Claim} />
            <Redirect path={`${match.path}/*`} to={`${match.path}/mint`} />
          </Switch>
        </div>
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
  padding-bottom: 100px;

  main {
    .content-layout {
      max-width: 720px;
      margin: 0 auto;
      padding: 0 20px;
      border-radius: 30px;
    }
  }

  // pc
  @media (min-width: ${screen.pc.min}px) {
    h1 {
      margin: 100px 0 80px 40px;
    }
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    h1 {
      margin: 80px 0 60px 30px;
    }
    
    .NeuSection-root {
      .NeuSection-content {
        padding: 30px;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    h1 {
      margin: 50px 0 40px 20px;
    }
    
    .NeuSection-root {
      .NeuSection-content {
        padding: 20px;
      }
    }
  }
`;
