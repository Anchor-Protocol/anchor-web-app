import { useBAssetInfoByTokenAddrQuery } from '@anchor-protocol/app-provider';
import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { CW20Addr } from '@libs/types';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';
import { WhExport } from './components/WhExport';
import { WhImport } from './components/WhImport';

export interface WormholeConvertProps
  extends RouteComponentProps<{ tokenAddr: CW20Addr | undefined }> {
  className?: string;
}

interface Item {
  label: string;
  value: string;
  tooltip: string;
}

function Component({ className, match, history }: WormholeConvertProps) {
  const { data: bAssetInfo } = useBAssetInfoByTokenAddrQuery(
    match.params.tokenAddr,
  );

  const tabItems = useMemo<Item[]>(() => {
    const symbol = bAssetInfo?.bAsset.symbol.substr(1) ?? 'ASSET';

    return [
      {
        label: `to b${symbol}`,
        value: 'to-basset',
        tooltip: 'Bond assets to mint bAssets',
      },
      {
        label: `to web${symbol}`,
        value: 'to-wbasset',
        tooltip: 'Burn previously minted bAssets to unbond your assets',
      },
    ];
  }, [bAssetInfo?.bAsset.symbol]);

  const pageMatch = useRouteMatch<{ page: string }>(`${match.url}/:page`);

  const tab = useMemo<Item | undefined>(() => {
    return tabItems.find(({ value }) => value === pageMatch?.params.page);
  }, [pageMatch?.params.page, tabItems]);

  const tabChange = useCallback(
    (nextTab: Item) => {
      history.push({
        pathname: `${match.url}/${nextTab.value}`,
      });
    },
    [history, match.url],
  );

  return (
    <div className={className}>
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
        <Redirect exact path={`${match.url}/`} to={`${match.url}/to-basset`} />
        <Route path={`${match.url}/to-basset`}>
          {bAssetInfo && <WhImport bAssetInfo={bAssetInfo} />}
        </Route>
        <Route path={`${match.url}/to-wbasset`}>
          {bAssetInfo && <WhExport bAssetInfo={bAssetInfo} />}
        </Route>
        <Redirect path={`${match.url}/*`} to={`${match.url}/to-basset`} />
      </Switch>
    </div>
  );
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const WormholeConvert = fixHMR(StyledComponent);
