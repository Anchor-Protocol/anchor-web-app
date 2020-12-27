import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
import { useState } from 'react';
import styled from 'styled-components';

export interface ChartSectionProps {
  className?: string;
}

type TabItem = 'deposit' | 'borrow';
const tabItems: TabItem[] = ['deposit', 'borrow'];

function ChartSectionBase({ className }: ChartSectionProps) {
  const [tab, setTab] = useState<TabItem>(() => 'deposit');

  return (
    <Section className={className}>
      <nav>
        <Tab
          items={tabItems}
          selectedItem={tab}
          onChange={setTab}
          labelFunction={(item) => item}
          keyFunction={(item) => item}
        />
        <div>
          <h3>NET RATE</h3>
          <p>11.16%</p>
        </div>
        <div>
          <h3>DEPOSIT APY</h3>
          <p>8.15%</p>
        </div>
        <div>
          <h3>DISTRIBUTION APY</h3>
          <p>3.01%</p>
        </div>
        <div>
          <h3>TOTAL DEPOSIT</h3>
          <p>$233.56M</p>
        </div>
      </nav>

      <HorizontalRuler />

      <figure></figure>
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
    border-radius: 20px;
    border: 2px dashed ${({ theme }) => theme.textColor};
  }
`;
