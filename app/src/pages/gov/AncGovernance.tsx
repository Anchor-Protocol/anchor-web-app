import { anc80gif, GifIcon } from '@anchor-protocol/token-icons';
import { RulerTab } from '@libs/neumorphism-ui/components/RulerTab';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { Circles } from 'components/primitives/Circles';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { screen } from 'env';
import { ROUTES } from 'pages/trade/env';
import React, { ReactNode, useCallback } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useMatch,
  Outlet,
} from 'react-router-dom';
import styled from 'styled-components';
import { AncGovernanceStake } from 'pages/gov/components/AncGovernanceStake';
import { AncGovernanceUnstake } from 'pages/gov/components/AncGovernanceUnstake';
import { AncGovernanceLock } from './components/AncGovernanceLock';
import { AncGovernanceUnlock } from './components/AncGovernanceUnlock';
import { UIElementProps } from '@libs/ui';
import { Tab } from '@libs/neumorphism-ui/components/Tab';

interface Item {
  label: string;
  value: string;
  tooltip?: ReactNode;
}

const TAB_ITEMS: Item[] = [
  { label: 'STAKE', value: 'stake' },
  { label: 'LOCK', value: 'lock' },
];

const STAKE_ITEMS: Item[] = [
  { label: 'Stake', value: 'stake', tooltip: '' },
  { label: 'Unstake', value: 'unstake', tooltip: '' },
];

const LOCK_ITEMS: Item[] = [
  { label: 'Lock', value: 'lock', tooltip: '' },
  { label: 'Unlock', value: 'unlock', tooltip: '' },
];

type TabReturn = [Item, (next: Item) => void];

const useTab = (): TabReturn => {
  const navigate = useNavigate();

  const pageMatch = useMatch(`/${ROUTES.ANC_GOVERNANCE}/:view`);

  const tabChange = useCallback(
    (nextTab: Item) => {
      navigate(
        nextTab.value === 'stake'
          ? `/${ROUTES.ANC_GOVERNANCE}/stake`
          : `/${ROUTES.ANC_GOVERNANCE}/lock`,
      );
    },
    [navigate],
  );

  switch (pageMatch?.params.view) {
    case 'stake':
    case 'unstake':
      return [TAB_ITEMS[0], tabChange];
    case 'lock':
    case 'unlock':
      return [TAB_ITEMS[1], tabChange];
  }
  return [TAB_ITEMS[0], tabChange];
};

type SubTabReturn = [Item, Item[], (next: Item) => void];

const useSubTab = (): SubTabReturn => {
  const navigate = useNavigate();

  const pageMatch = useMatch(`/${ROUTES.ANC_GOVERNANCE}/:view`);

  const tabChange = useCallback(
    (nextTab: Item) => {
      navigate(`/${ROUTES.ANC_GOVERNANCE}/${nextTab.value}`);
    },
    [navigate],
  );

  switch (pageMatch?.params.view) {
    case 'stake':
      return [STAKE_ITEMS[0], STAKE_ITEMS, tabChange];
    case 'unstake':
      return [STAKE_ITEMS[1], STAKE_ITEMS, tabChange];
    case 'lock':
      return [LOCK_ITEMS[0], LOCK_ITEMS, tabChange];
    case 'unlock':
      return [LOCK_ITEMS[1], LOCK_ITEMS, tabChange];
  }

  return [STAKE_ITEMS[0], STAKE_ITEMS, tabChange];
};

const AncGovernanceBase = (props: UIElementProps) => {
  const { className } = props;

  const [tab, tabChange] = useTab();

  const [subTab, subTabItems, subTabChange] = useSubTab();

  return (
    <CenteredLayout className={className}>
      <header>
        <h1>
          <Circles radius={24} backgroundColors={['#2C2C2C']}>
            <GifIcon
              src={anc80gif}
              style={{ fontSize: '2em', borderRadius: '50%' }}
            />
          </Circles>
          ANC Governance
        </h1>
        <Tab
          items={TAB_ITEMS}
          selectedItem={tab}
          onChange={tabChange}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}
          height={46}
          borderRadius={30}
          fontSize={12}
        />
      </header>

      <Section>
        <RulerTab
          className="subtab"
          items={subTabItems}
          selectedItem={subTab}
          onChange={subTabChange}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}
          tooltipFunction={({ tooltip }) => tooltip}
        />

        <div className="form">
          <Routes>
            <Route path="/stake" element={<AncGovernanceStake />} />
            <Route path="/unstake" element={<AncGovernanceUnstake />} />
            <Route path="/lock" element={<AncGovernanceLock />} />
            <Route path="/unlock" element={<AncGovernanceUnlock />} />
            <Route
              path="*"
              element={<Navigate to={`/${ROUTES.ANC_GOVERNANCE}/stake`} />}
            />
          </Routes>
          <Outlet />
        </div>
      </Section>
    </CenteredLayout>
  );
};

export const AncGovernance = styled(AncGovernanceBase)`
  header {
    display: grid;
    grid-template-columns: 1fr 375px;
    align-items: center;

    margin-bottom: 40px;

    h1 {
      font-size: 44px;
      font-weight: 900;
      display: flex;
      align-items: center;

      word-break: keep-all;
      white-space: nowrap;

      > :first-child {
        margin-right: 14px;
      }
    }
  }

  .subtab {
    margin-bottom: 70px;
  }

  .form {
    .description {
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

    .amount {
      width: 100%;

      margin-bottom: 5px;
    }

    .wallet {
      display: flex;
      justify-content: space-between;

      font-size: 12px;
      color: ${({ theme }) => theme.dimTextColor};

      &[aria-invalid='true'] {
        color: ${({ theme }) => theme.colors.negative};
      }
    }

    .separator {
      margin: 10px 0 0 0;
    }

    .receipt {
      margin-top: 30px;
    }

    .submit {
      margin-top: 40px;

      width: 100%;
      height: 60px;
    }
  }

  // under tablet
  @media (max-width: ${screen.tablet.max}px) {
    header {
      h1 {
        font-size: 32px;
      }

      margin-bottom: 20px;
    }
  }
`;
