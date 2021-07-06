import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { screen } from 'env';
import React from 'react';
import styled from 'styled-components';
import { Rewards } from './components/Rewards';
import { TransactionHistory } from './components/TransactionHistory';

export interface MypageProps {
  className?: string;
}

function MypageBase({ className }: MypageProps) {
  return (
    <PaddedLayout className={className}>
      <Rewards />
      <h2>Transaction History</h2>
      <TransactionHistory />
    </PaddedLayout>
  );
}

export const StyledMypage = styled(MypageBase)`
  h1 {
    font-size: 44px;
    margin-bottom: 40px;
  }

  @media (max-width: ${screen.tablet.max}px) {
    h1 {
      font-size: 34px;
      margin-bottom: 25px;
    }
  }

  @media (max-width: ${screen.mobile.max}px) {
    h1 {
      font-size: 24px;
      margin-bottom: 15px;
    }
  }
`;

export const Mypage =
  process.env.NODE_ENV === 'production'
    ? StyledMypage
    : (props: MypageProps) => <StyledMypage {...props} />;
