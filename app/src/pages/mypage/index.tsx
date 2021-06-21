import { CenteredLayout } from 'components/layouts/CenteredLayout';
import React from 'react';
import styled from 'styled-components';
import { TransactionHistory } from './components/TransactionHistory';
import { screen } from 'env';

export interface MypageProps {
  className?: string;
}

function MypageBase({ className }: MypageProps) {
  return (
    <CenteredLayout className={className} maxWidth={940}>
      <h1>Transaction History</h1>
      <TransactionHistory />
    </CenteredLayout>
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
