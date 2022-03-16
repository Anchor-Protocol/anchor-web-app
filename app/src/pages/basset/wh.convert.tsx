import { useBAssetInfoByTokenSymbolQuery } from '@anchor-protocol/app-provider';
import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { UIElementProps } from '@libs/ui';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo } from 'react';
import { useMatch, useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';

interface Item {
  label: string;
  value: string;
  tooltip: string;
}

function Component({ className }: UIElementProps) {
  const navigate = useNavigate();

  const match = useMatch({ path: '/basset/wh/:tokenSymbol/:page', end: true });

  const { data: bAssetInfo } = useBAssetInfoByTokenSymbolQuery(
    match?.params.tokenSymbol,
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

  const tab = useMemo<Item | undefined>(() => {
    return tabItems.find(({ value }) => value === match?.params.page);
  }, [match?.params.page, tabItems]);

  const tabChange = useCallback(
    (nextTab: Item) => {
      navigate(`/basset/wh/${match?.params.tokenSymbol}/${nextTab.value}`);
    },
    [navigate, match?.params.tokenSymbol],
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
      <Outlet />
    </CenteredLayout>
  );
}

const StyledComponent = styled(Component)`
  .tab {
    margin-bottom: 40px;
  }
`;

export const WormholeConvert = fixHMR(StyledComponent);
