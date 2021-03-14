import { CoinChart } from '@anchor-protocol/webapp-charts/CoinChart';
import { HorizontalRuler } from '@terra-dev/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { Tab } from '@terra-dev/neumorphism-ui/components/Tab';
import { useState } from 'react';
import styled from 'styled-components';

export interface ChartSectionProps {
  className?: string;
}

type TabItem = 'collateral' | 'loan';
const tabItems: TabItem[] = ['collateral', 'loan'];

function ChartSectionBase({ className }: ChartSectionProps) {
  const [tab, setTab] = useState<TabItem>(() => 'collateral');

  return (
    <Section className={className}>
      <nav>
        <Tab
          items={tabItems}
          selectedItem={tab}
          onChange={setTab}
          labelFunction={(item) => item.toUpperCase()}
          keyFunction={(item) => item}
          fontSize={14}
          borderRadius={32}
        />
        <div>
          <h3>STAKING RETURN</h3>
          <p>11.16%</p>
        </div>
        <div>
          <h3>TOTAL COLLATERAL</h3>
          <p>$233.56M</p>
        </div>
      </nav>

      <HorizontalRuler />

      <CoinChart
        margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
        gutter={{ top: 20, bottom: 20, left: 100, right: 100 }}
        data={[
          { label: 'A', apy: 0.72, total: 10 },
          { label: 'B', apy: 0, total: 24 },
          { label: 'C', apy: 0.46, total: 17 },
          { label: 'D', apy: 0.4, total: 14 },
          { label: 'E', apy: 0.7, total: 23 },
          { label: 'F', apy: 0.9, total: 26 },
          { label: 'G', apy: 1.2, total: 56 },
          { label: 'H', apy: 0.5, total: 45 },
          { label: 'I', apy: 0.2, total: 70 },
          { label: 'J', apy: 0.45, total: 100 },
          { label: 'K', apy: 0.8, total: 92 },
          { label: 'A', apy: 0.72, total: 10 },
          { label: 'B', apy: 0, total: 24 },
          { label: 'C', apy: 0.46, total: 17 },
          { label: 'D', apy: 0.4, total: 14 },
          { label: 'E', apy: 0.7, total: 23 },
          { label: 'F', apy: 0.9, total: 26 },
          { label: 'G', apy: 1.2, total: 56 },
          { label: 'H', apy: 0.5, total: 45 },
          { label: 'I', apy: 0.2, total: 70 },
          { label: 'J', apy: 0.45, total: 100 },
          { label: 'K', apy: 0.8, total: 92 },
        ]}
      />
    </Section>
  );
}

export const ChartSection = styled(ChartSectionBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  nav {
    display: flex;
    align-items: center;

    text-align: right;

    > :first-child {
      width: 276px;
    }

    > :nth-child(2) {
      flex: 1;
    }

    > :not(:first-child) {
      margin-left: 60px;
    }

    h3 {
      font-size: 11px;
      font-weight: 500;
      color: ${({ theme }) => theme.dimTextColor};
    }

    p {
      font-size: 18px;
      color: ${({ theme }) => theme.textColor};
    }
  }

  hr {
    margin: 24px 0;
  }

  figure {
    height: 420px;
  }
`;
