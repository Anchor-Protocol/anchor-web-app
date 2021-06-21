import { PaddedLayout } from 'components/layouts/PaddedLayout';
import React from 'react';
import styled from 'styled-components';
import { TransactionHistory } from './components/TransactionHistory';

export interface MypageProps {
  className?: string;
}

function MypageBase({ className }: MypageProps) {
  return (
    <PaddedLayout className={className}>
      <h1>Transaction History</h1>
      <TransactionHistory />
    </PaddedLayout>
  );
}

export const StyledMypage = styled(MypageBase)`
  // TODO
`;

export const Mypage =
  process.env.NODE_ENV === 'production'
    ? StyledMypage
    : (props: MypageProps) => <StyledMypage {...props} />;
