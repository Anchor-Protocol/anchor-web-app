import { useBAssetInfoByTokenSymbolQuery } from '@anchor-protocol/app-provider';
import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
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
  extends RouteComponentProps<{ tokenSymbol: string | undefined }> {
  className?: string;
}

interface Item {
  label: string;
  value: string;
  tooltip: string;
}

function Component({ className, match, history }: WormholeConvertProps) {
  const { data: bAssetInfo } = useBAssetInfoByTokenSymbolQuery(
    match.params.tokenSymbol,
  );

  const tabItems = useMemo<Item[]>(() => {
    const bAssetSymbol = bAssetInfo
      ? bAssetInfo.tokenDisplay.anchor.symbol
      : 'ASSET';
    const whAssetSymbol = bAssetInfo
      ? bAssetInfo.tokenDisplay.wormhole.symbol
      : 'whASSET';

    return [
      {
        label: `to ${bAssetSymbol}`,
        value: 'to-basset',
        tooltip:
          'Convert wormhole tokens into bAssets that are useable on Anchor.',
      },
      {
        label: `to ${whAssetSymbol}`,
        value: 'to-wbasset',
        tooltip: 'Convert bAssets useable on Anchor into wormhole tokens.',
      },
    ];
  }, [bAssetInfo]);

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
    <CenteredLayout className={className} maxWidth={800}>
      <TitleContainer>
        <PageTitle
          title="CONVERT"
          tooltip="Tokens transferred to the terra chain through wormhole must be converted to bAssets useable on Anchor to be deposited as collateral."
        />
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
        <Redirect exact path={`${match.url}/`} to={`${match.url}/to-basset`} />
        <Route path={`${match.url}/to-basset`}>
          {bAssetInfo && <WhImport bAssetInfo={bAssetInfo} />}
        </Route>
        <Route path={`${match.url}/to-wbasset`}>
          {bAssetInfo && <WhExport bAssetInfo={bAssetInfo} />}
        </Route>
        <Redirect path={`${match.url}/*`} to={`${match.url}/to-basset`} />
      </Switch>
    </CenteredLayout>
  );
}

const StyledComponent = styled(Component)`
  .tab {
    margin-bottom: 40px;
  }
`;

export const WormholeConvert = fixHMR(StyledComponent);
