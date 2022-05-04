import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { links } from 'env';
import React, { useCallback } from 'react';
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
import { VStack } from '@libs/ui/Stack';

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

export function GovernanceMain() {
  const [tab, onTabChange] = useTab();

  return (
    <PaddedLayout>
      <VStack gap={40}>
        <VStack>
          <TitleContainer>
            <PageTitle title="GOVERNANCE" docs={links.docs.gov} />
          </TitleContainer>
          <Tab
            items={TAB_ITEMS}
            selectedItem={tab}
            onChange={onTabChange}
            labelFunction={({ label }) => label}
            keyFunction={({ value }) => value}
            height={46}
            borderRadius={30}
            fontSize={12}
          />
        </VStack>
        <div>
          <Routes>
            <Route index={true} element={<Overview />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/gauges" element={<Gauges />} />
            <Route path="*" element={<Navigate to={`/gov`} />} />
          </Routes>
          <Outlet />
        </div>
      </VStack>
    </PaddedLayout>
  );
}
