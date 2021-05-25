import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { Tab } from '@terra-dev/neumorphism-ui/components/Tab';
import { Swap as SwapTabContent } from 'pages/basset/components/Swap';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Burn as BurnTabContent } from './components/Burn';

export interface BurnProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const tabItems: Item[] = [
  {
    label: 'BURN',
    value: 'burn',
  },
  {
    label: 'INSTANT BURN',
    value: 'instant_burn',
  },
];

function BurnBase({ className }: BurnProps) {
  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [tab, setTab] = useState<Item>(() => tabItems[0]);

  return (
    <Section className={className}>
      <Tab
        className="tab"
        style={{ maxWidth: 400 }}
        items={tabItems}
        selectedItem={tab ?? tabItems[0]}
        onChange={setTab}
        labelFunction={({ label }) => label}
        keyFunction={({ value }) => value}
        height={46}
        borderRadius={30}
        fontSize={12}
      />

      {tab === tabItems[0] ? <BurnTabContent /> : <SwapTabContent />}
    </Section>
  );
}

export const Burn = styled(BurnBase)`
  .burn-description,
  .gett-description {
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

  .burn,
  .gett {
    margin-bottom: 30px;
  }

  hr {
    margin: 40px 0;
  }

  .validator {
    width: 100%;
    margin-bottom: 40px;

    &[data-selected-value=''] {
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .receipt {
    margin-bottom: 40px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
