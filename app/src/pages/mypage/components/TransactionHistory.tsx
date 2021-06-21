import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import styled from 'styled-components';
import React from 'react';

export interface TransactionHistoryProps {
  className?: string;
}

function TransactionHistoryBase({ className }: TransactionHistoryProps) {
  return (
    <Section className={className}>
      <ul>
        <li>...</li>
        <li>...</li>
        <li>...</li>
        <li>...</li>
      </ul>
    </Section>
  );
}

export const StyledTransactionHistory = styled(TransactionHistoryBase)`
  // TODO
`;

export const TransactionHistory =
  process.env.NODE_ENV === 'production'
    ? StyledTransactionHistory
    : (props: TransactionHistoryProps) => (
        <StyledTransactionHistory {...props} />
      );
