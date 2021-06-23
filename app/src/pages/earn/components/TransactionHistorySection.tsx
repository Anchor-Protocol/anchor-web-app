import { useMypageTxHistoryQuery } from '@anchor-protocol/webapp-provider';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { TransactionHistoryList } from 'pages/mypage/components/TransactionHistoryList';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface TransactionHistorySectionProps {
  className?: string;
}

export function TransactionHistorySection({
  className,
}: TransactionHistorySectionProps) {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { history } = useMypageTxHistoryQuery();

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <Header>
        <h2>TRANSACTION HISTORY</h2>
        {history.length > 3 && (
          <BorderButton component={Link} to="/mypage">
            More
          </BorderButton>
        )}
      </Header>

      <HorizontalHeavyRuler />

      {history.length > 0 ? (
        <TransactionHistoryList history={history.slice(0, 3)} />
      ) : (
        <EmptyMessage>
          <h3>No transaction history</h3>
          <p>Looks like you haven't made any transactions yet.</p>
        </EmptyMessage>
      )}
    </Section>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin-bottom: 0 !important;
  }

  .MuiButtonBase-root {
    width: 68px;
    height: 32px;
  }

  margin-bottom: 14px;
`;

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
