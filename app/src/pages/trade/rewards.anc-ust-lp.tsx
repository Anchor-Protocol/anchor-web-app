import { anc80gif, GifIcon, TokenIcon } from '@anchor-protocol/token-icons';
import { RulerTab } from '@libs/neumorphism-ui/components/RulerTab';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { Circles } from 'components/primitives/Circles';
import { screen } from 'env';
import { AncUstLpProvide } from 'pages/trade/components/AncUstLpProvide';
import { AncUstLpStake } from 'pages/trade/components/AncUstLpStake';
import { AncUstLpStakeOverview } from 'pages/trade/components/AncUstLpStakeOverview';
import { AncUstLpUnstake } from 'pages/trade/components/AncUstLpUnstake';
import { AncUstLpWithdraw } from 'pages/trade/components/AncUstLpWithdraw';
import { ancUstLpPathname } from 'pages/trade/env';
import React, { ReactNode, useCallback, useMemo } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useMatch,
  Outlet,
} from 'react-router-dom';
import styled from 'styled-components';

export interface RewardsAncUstLpProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
  tooltip?: ReactNode;
}

const tabItems: Item[] = [
  { label: 'POOL', value: 'pool' },
  { label: 'STAKE', value: 'stake' },
];

const poolItems: Item[] = [
  {
    label: 'Provide',
    value: 'provide',
    tooltip:
      'Provide liquidity to receive LP tokens. LP tokens can be staked to earn ANC token rewards',
  },
  {
    label: 'Withdraw',
    value: 'withdraw',
    tooltip: 'Withdraw ANC liquidity provided by burning LP tokens',
  },
];

const stakeItems: Item[] = [
  {
    label: 'Stake',
    value: 'stake',
    tooltip: 'Stake LP tokens to earn ANC token rewards',
  },
  {
    label: 'Unstake',
    value: 'unstake',
    tooltip: 'Unstake LP tokens to withdraw provided liquidity',
  },
];

function RewardsAncUstLpBase({ className }: RewardsAncUstLpProps) {
  const navigate = useNavigate();

  const pageMatch = useMatch(`/${ancUstLpPathname}/:view`);

  const tab = useMemo<Item | undefined>(() => {
    switch (pageMatch?.params.view) {
      case 'provide':
      case 'withdraw':
        return tabItems[0];
      case 'stake':
      case 'unstake':
        return tabItems[1];
    }
  }, [pageMatch?.params.view]);

  const tabChange = useCallback(
    (nextTab: Item) => {
      navigate(
        nextTab.value === 'stake'
          ? `/${ancUstLpPathname}/stake`
          : `/${ancUstLpPathname}/provide`,
      );
    },
    [navigate],
  );

  const subTab = useMemo<Item | undefined>(() => {
    switch (pageMatch?.params.view) {
      case 'provide':
        return poolItems[0];
      case 'withdraw':
        return poolItems[1];
      case 'stake':
        return stakeItems[0];
      case 'unstake':
        return stakeItems[1];
    }
  }, [pageMatch?.params.view]);

  const subTabChange = useCallback(
    (nextTab: Item) => {
      navigate(`/${ancUstLpPathname}/${nextTab.value}`);
    },
    [navigate],
  );

  return (
    <CenteredLayout className={className}>
      <header>
        <h1>
          <Circles radius={24} backgroundColors={['#ffffff', '#2C2C2C']}>
            <TokenIcon token="ust" style={{ fontSize: '1.1em' }} />
            <GifIcon
              src={anc80gif}
              style={{ fontSize: '2em', borderRadius: '50%' }}
            />
          </Circles>
          ANC-UST LP
        </h1>
        <Tab
          items={tabItems}
          selectedItem={tab ?? tabItems[0]}
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
          items={tab?.value === 'stake' ? stakeItems : poolItems}
          selectedItem={
            subTab ?? (tab?.value === 'stake' ? stakeItems[0] : poolItems[0])
          }
          onChange={subTabChange}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}
          tooltipFunction={({ tooltip }) => tooltip}
        />

        <div className="form">
          {tab?.value === 'stake' && <AncUstLpStakeOverview />}

          <Routes>
            <Route path={`/provide`} element={<AncUstLpProvide />} />
            <Route path={`/withdraw`} element={<AncUstLpWithdraw />} />
            <Route path={`/stake`} element={<AncUstLpStake />} />
            <Route path={`/unstake`} element={<AncUstLpUnstake />} />
            <Route
              path={``}
              element={<Navigate to={`/${ancUstLpPathname}/provide`} />}
            />
            <Route
              path={`*`}
              element={<Navigate to={`/${ancUstLpPathname}/provide`} />}
            />
          </Routes>

          <Outlet />
        </div>
      </Section>
    </CenteredLayout>
  );
}

export const RewardsAncUstLp = styled(RewardsAncUstLpBase)`
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
    margin-bottom: 40px;
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

      grid-template-columns: 1fr;
      grid-gap: 20px;
    }

    .subtab {
      margin-bottom: 20px;
    }
  }
`;
