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
import { AncUnstake } from 'pages/gov/components/AncUnstake';
import { UIElementProps } from '@libs/ui';
import { AncStake } from './components/AncStake';

interface Item {
  label: string;
  value: string;
  tooltip?: ReactNode;
}

const TAB_ITEMS: Item[] = [
  { label: 'Stake', value: 'stake' },
  { label: 'Unstake', value: 'unstake' },
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
          : `/${ROUTES.ANC_GOVERNANCE}/unstake`,
      );
    },
    [navigate],
  );

  switch (pageMatch?.params.view) {
    case 'stake':
      return [TAB_ITEMS[0], tabChange];
    case 'unstake':
      return [TAB_ITEMS[1], tabChange];
  }
  return [TAB_ITEMS[0], tabChange];
};

const AncGovernanceBase = (props: UIElementProps) => {
  const { className } = props;

  const [tab, tabChange] = useTab();

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
      </header>

      <Section>
        <RulerTab
          className="subtab"
          items={TAB_ITEMS}
          selectedItem={tab}
          onChange={tabChange}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}
          tooltipFunction={({ tooltip }) => tooltip}
        />

        <div className="form">
          <Routes>
            <Route path="/stake" element={<AncStake />} />
            <Route path="/unstake" element={<AncUnstake />} />
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
    margin-bottom: 50px;
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
