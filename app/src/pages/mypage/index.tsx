import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
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
      <TitleContainer>
        <PageTitle title="MY PAGE" />
      </TitleContainer>

      <Rewards />
      <h2>Transaction History</h2>
      <TransactionHistory />
    </PaddedLayout>
  );
}

export const StyledMypage = styled(MypageBase)``;

export const Mypage =
  process.env.NODE_ENV === 'production'
    ? StyledMypage
    : (props: MypageProps) => <StyledMypage {...props} />;
