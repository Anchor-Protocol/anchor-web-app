import { useMypageTxHistoryQuery } from '@anchor-protocol/webapp-provider';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { TransactionHistoryEmptyMessage } from 'pages/mypage/components/TransactionHistoryEmptyMessage';
import { TransactionHistoryList } from 'pages/mypage/components/TransactionHistoryList';
import { TransactionHistoryProgressSpinner } from 'pages/mypage/components/TransactionHistoryProgressSpinner';
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
  const { history, inProgress } = useMypageTxHistoryQuery();

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

      {history.length > 0 && (
        <TransactionHistoryList
          history={history.slice(0, 3)}
          breakpoint={600}
        />
      )}

      {history.length === 0 && !inProgress && (
        <TransactionHistoryEmptyMessage />
      )}

      {inProgress && <TransactionHistoryProgressSpinner size="large" />}
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
