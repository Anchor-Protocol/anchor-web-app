import { useMypageTxHistoryQuery } from '@anchor-protocol/webapp-provider';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import React from 'react';
import styled from 'styled-components';
import { TransactionHistoryList } from './TransactionHistoryList';

export interface TransactionHistoryProps {
  className?: string;
}

function TransactionHistoryBase({ className }: TransactionHistoryProps) {
  const { history, isLast, loadMore } = useMypageTxHistoryQuery();

  return (
    <Section className={className}>
      {history.length > 0 ? (
        <TransactionHistoryList history={history} />
      ) : (
        <EmptyMessage>
          <h3>No transaction history</h3>
          <p>Looks like you haven't made any transactions yet.</p>
        </EmptyMessage>
      )}

      {!isLast && (
        <footer>
          <ActionButton onClick={loadMore}>More</ActionButton>
        </footer>
      )}
    </Section>
  );
}

const EmptyMessage = styled.div`
  height: 280px;
  display: grid;
  place-content: center;
  text-align: center;

  h3 {
    font-size: 18px;
    font-weight: 500;

    margin-bottom: 8px;
  }

  p {
    font-size: 13px;
    color: ${({ theme }) => theme.dimTextColor};
  }
`;

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
