import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import {
  MultiColumnTable,
  MultiColumnTableCell,
} from '@terra-dev/neumorphism-ui/components/MultiColumnTable';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import styled from 'styled-components';

export interface MarketDetailsSectionProps {
  className?: string;
}

function MarketDetailsSectionBase({ className }: MarketDetailsSectionProps) {
  return (
    <Section className={className}>
      <h2>MARKET DETAILS</h2>

      <HorizontalHeavyRuler />

      <MultiColumnTable>
        <MultiColumnTableCell label="Price">$1.00</MultiColumnTableCell>
        <MultiColumnTableCell label="Marker Liquidity">
          100,232,859 UST
        </MultiColumnTableCell>
        <MultiColumnTableCell label="# of Suppliers">
          142,954
        </MultiColumnTableCell>
        <MultiColumnTableCell label="# of Borrowers">
          9,230
        </MultiColumnTableCell>
        <MultiColumnTableCell label="Deposit APY">8.15%</MultiColumnTableCell>
        <MultiColumnTableCell label="Borrow APR">12.32%</MultiColumnTableCell>
        <MultiColumnTableCell label="Daily interest">
          $51,232
        </MultiColumnTableCell>
        <MultiColumnTableCell label="Interest from borrow">
          $32,232
        </MultiColumnTableCell>
        <MultiColumnTableCell label="Interest from Staking Reward">
          $20,000
        </MultiColumnTableCell>
        <MultiColumnTableCell label="aToken Supply">
          349,119,129
        </MultiColumnTableCell>
        <MultiColumnTableCell label="Exchange Rate">
          1 UST = 1.<sub>4294838294</sub> aUST
        </MultiColumnTableCell>
      </MultiColumnTable>
    </Section>
  );
}

export const MarketDetailsSection = styled(MarketDetailsSectionBase)`
  .NeuSection-content {
    > h2 {
      font-size: 13px;
      font-weight: 500;
      color: #1f1f1f;
    }

    > hr {
      margin: 16px 0 0 0;
    }
  }
`;
