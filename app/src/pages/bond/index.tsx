import { Tab } from '@terra-dev/neumorphism-ui/components/Tab';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { links } from 'env';
import React, { useCallback, useMemo } from 'react';
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
    <CenteredLayout className={className}>
      <TitleContainer>
        <PageTitle title="BOND" docs={links.docs.bond} />
      </TitleContainer>

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
    </CenteredLayout>
  );
}

export const BAsset = styled(BAssetBase)`
  .tab {
    margin-bottom: 40px;
  }
`;
