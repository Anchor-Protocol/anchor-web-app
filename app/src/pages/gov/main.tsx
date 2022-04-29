import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { links } from 'env';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { Overview } from './components/Overview';
import { Polls } from './components/Polls';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useMatch,
  useNavigate,
} from 'react-router-dom';
import { Gauges } from 'pages/gauges';

interface Item {
  label: string;
  value: string;
}

const TAB_ITEMS: Item[] = [
  { label: 'OVERVIEW', value: 'overview' },
  { label: 'POLLS', value: 'polls' },
  { label: 'GAUGES', value: 'gauges' },
];

type TabReturn = [Item, (next: Item) => void];

const useTab = (): TabReturn => {
  const navigate = useNavigate();

  const pageMatch = useMatch(`/gov/:view`);

  const tabChange = useCallback(
    (nextTab: Item) => {
      navigate(
        nextTab.value === 'overview'
          ? `/gov`
          : nextTab.value === 'polls'
          ? `/gov/polls`
          : `/gov/gauges`,
      );
    },
    [navigate],
  );

  switch (pageMatch?.params.view) {
    case 'polls':
      return [TAB_ITEMS[1], tabChange];
    case 'gauges':
      return [TAB_ITEMS[2], tabChange];
  }
  return [TAB_ITEMS[0], tabChange];
};

interface GovernanceMainProps {
  className?: string;
}

function GovernanceMainBase({ className }: GovernanceMainProps) {
  const [tab, onTabChange] = useTab();

  return (
    <PaddedLayout className={className}>
      <TitleContainer className="title">
        <PageTitle title="GOVERNANCE" docs={links.docs.gov} />
      </TitleContainer>
      <Tab
        className="tabs"
        items={TAB_ITEMS}
        selectedItem={tab}
        onChange={onTabChange}
        labelFunction={({ label }) => label}
        keyFunction={({ value }) => value}
        height={46}
        borderRadius={30}
        fontSize={12}
      />
      <div className="outlet">
        <Routes>
          <Route index={true} element={<Overview />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/gauges" element={<Gauges />} />
          <Route path="*" element={<Navigate to={`/gov`} />} />
        </Routes>
        <Outlet />
      </div>
    </PaddedLayout>
  );
}

export const GovernanceMain = styled(GovernanceMainBase)`
  .content-layout {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;

    .title {
      grid-row: 1;
      grid-column: 1;
    }

    .tabs {
      min-width: 500px;
      grid-row: 1;
      grid-column: 2;
    }

    .outlet {
      grid-row: 2;
      grid-column: 1 / span 2;
    }
  }
`;
