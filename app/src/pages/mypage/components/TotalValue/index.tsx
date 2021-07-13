import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uUST } from '@anchor-protocol/types';
import { Send } from '@material-ui/icons';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { Item } from './types';

export interface TotalValueProps {
  className?: string;
}

const colors = [
  '#4bdb4b',
  '#36a337',
  '#2d832d',
  '#246d25',
  '#174f1a',
  '#0e3311',
  '#101010',
];

const data: Item[] = [
  { label: 'UST', amount: '130494000' as uUST },
  { label: 'Deposit', amount: '243512000' as uUST },
  { label: 'Borrowing', amount: '7223295000' as uUST },
  { label: 'Holding', amount: '223395000' as uUST },
  { label: 'Pool', amount: '1395000' as uUST },
  { label: 'Farming', amount: '95595000' as uUST },
  { label: 'Govern', amount: '94049000' as uUST },
];

function TotalValueBase({ className }: TotalValueProps) {
  return (
    <Section className={className}>
      <header>
        <div>
          <h4>Total Value</h4>
          <p>
            93,238.03 <span>UST</span>
          </p>
        </div>
        <div>
          <BorderButton>
            <Send />
            Send
          </BorderButton>
        </div>
      </header>

      <ul>
        {data.map(({ label, amount }, i) => (
          <li key={label}>
            <i style={{ backgroundColor: colors[i] }} />
            <p>{label}</p>
            <p>{formatUSTWithPostfixUnits(demicrofy(amount))} UST</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export const StyledTotalValue = styled(TotalValueBase)`
  header {
    display: flex;
    justify-content: space-between;

    h4 {
      font-size: 16px;
      margin-bottom: 10px;
    }

    p {
      font-size: 36px;
      font-weight: 500;

      span {
        font-size: 20px;
      }
    }

    button {
      font-size: 14px;
      padding: 0 13px;
      height: 32px;

      svg {
        font-size: 1em;
        margin-right: 0.3em;
      }
    }
  }

  ul {
    margin-top: 50px;

    padding: 0 0 0 12px;
    list-style: none;

    display: inline-grid;
    grid-template-rows: repeat(4, auto);
    grid-auto-flow: column;
    grid-row-gap: 20px;
    grid-column-gap: 50px;

    li {
      position: relative;

      i {
        position: absolute;
        left: -12px;
        top: 5px;

        display: inline-block;
        min-width: 7px;
        min-height: 7px;
        max-width: 7px;
        max-height: 7px;
      }

      p:nth-of-type(1) {
        font-size: 12px;
        font-weight: 500;
        line-height: 1.5;
      }

      p:nth-of-type(2) {
        font-size: 13px;
        line-height: 1.5;
      }
    }
  }
`;

export const TotalValue = fixHMR(StyledTotalValue);
