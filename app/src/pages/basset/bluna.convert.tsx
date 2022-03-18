import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { UIElementProps } from '@libs/ui';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { fixHMR } from 'fix-hmr';
import { BLunaBurn } from 'pages/basset/components/BLunaBurn';
import { BLunaMint } from 'pages/basset/components/BLunaMint';
import React, { useCallback, useMemo } from 'react';
import { useMatch, useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';

interface Item {
  label: string;
  value: string;
  tooltip: string;
}

const tabItems: Item[] = [
  { label: 'MINT', value: 'mint', tooltip: 'Bond LUNA to mint bLUNA' },
  {
    label: 'BURN',
    value: 'burn',
    tooltip: 'Burn previously minted bLUNA to unbond your LUNA',
  },
];

function Component({ className }: UIElementProps) {
  const navigate = useNavigate();

  const match = useMatch({ path: '/basset/bluna/:page', end: true });

  const tab = useMemo<Item | undefined>(() => {
    return tabItems.find(({ value }) => value === match?.params.page);
  }, [match?.params.page]);

  const tabChange = useCallback(
    (nextTab: Item) => {
      navigate(`/basset/bluna/${nextTab.value}`);
    },
    [navigate],
  );

  return (
    <CenteredLayout maxWidth={800} className={className}>
      <TitleContainer>
        <PageTitle title="MINT & BURN" />
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

export const BlunaConvert = fixHMR(StyledComponent);

export { BLunaMint, BLunaBurn };
