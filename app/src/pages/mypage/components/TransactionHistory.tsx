import { useMypageTxHistoryQuery } from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import React from 'react';
import styled from 'styled-components';
import { TransactionHistoryEmptyMessage } from './TransactionHistoryEmptyMessage';
import { TransactionHistoryList } from './TransactionHistoryList';
import { TransactionHistoryProgressSpinner } from './TransactionHistoryProgressSpinner';

export interface TransactionHistoryProps {
  className?: string;
}

function TransactionHistoryBase({ className }: TransactionHistoryProps) {
  const { history, isLast, loadMore, inProgress } = useMypageTxHistoryQuery();

  return (
    <Section className={className}>
      {history.length > 0 && <TransactionHistoryList history={history} />}

      {history.length === 0 && !inProgress && (
        <TransactionHistoryEmptyMessage />
      )}

      {inProgress && (
        <TransactionHistoryProgressSpinner
          size={history.length > 0 ? 'small' : 'large'}
        />
      )}

      {!isLast && !inProgress && (
        <footer>
          <ActionButton onClick={loadMore}>More</ActionButton>
        </footer>
      )}
    </Section>
  );
}

export const StyledTransactionHistory = styled(TransactionHistoryBase)`
  footer {
    margin-top: 40px;

    display: flex;
    justify-content: center;

    button {
      width: 100%;
      max-width: 400px;
    }
  }
`;

export const TransactionHistory =
  process.env.NODE_ENV === 'production'
    ? StyledTransactionHistory
    : (props: TransactionHistoryProps) => (
        <StyledTransactionHistory {...props} />
      );
