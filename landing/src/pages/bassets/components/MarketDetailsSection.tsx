import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import {
  MultiColumnTable,
  MultiColumnTableCell,
} from '@anchor-protocol/neumorphism-ui/components/MultiColumnTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
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
        <MultiColumnTableCell label="Price">$5.95</MultiColumnTableCell>
        <MultiColumnTableCell label="Exchange rate">
          1ATOM = 1bATOM
        </MultiColumnTableCell>
        <MultiColumnTableCell label="# of Borrowers">
          1,230
        </MultiColumnTableCell>
        <MultiColumnTableCell label="Daily staking reward">
          $40,209
        </MultiColumnTableCell>
        <MultiColumnTableCell label="Daily interest">
          $24,931
        </MultiColumnTableCell>
        <MultiColumnTableCell label="Daily interest from borrow">
          $16,042
        </MultiColumnTableCell>
        <MultiColumnTableCell label="Daily interest from staking reward">
          $8,889
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
