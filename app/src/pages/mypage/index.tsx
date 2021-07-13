import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import React from 'react';
import styled from 'styled-components';
import { BorrowedValue } from './components/BorrowedValue';
import { Earn } from './components/Earn';
import { Govern } from './components/Govern';
import { Rewards } from './components/Rewards';
import { TotalClaimableRewards } from './components/TotalClaimableRewards';
import { TotalCollateralValue } from './components/TotalCollateralValue';
import { TotalValue } from './components/TotalValue';
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

      <OverviewRow>
        <TotalValue />
        <TotalClaimableRewards />
      </OverviewRow>

      <h2>REWARDS</h2>
      <Rewards />

      <h2>EARN</h2>
      <Earn />

      <h2>BORROW</h2>
      <BorrowRow>
        <TotalCollateralValue />
        <BorrowedValue />
      </BorrowRow>

      <h2>GOVERN</h2>
      <Govern />

      <h2>TRANSACTION HISTORY</h2>
      <TransactionHistory />
    </PaddedLayout>
  );
}

const OverviewRow = styled.div`
  display: flex;
  column-gap: 40px;

  .NeuSection-root {
    margin-bottom: 0;
  }

  > :nth-child(1) {
    flex: 1;
  }

  > :nth-child(2) {
    width: 532px;
  }
`;

const BorrowRow = styled.div`
  display: flex;
  column-gap: 40px;

  .NeuSection-root {
    margin-bottom: 0;
  }

  > * {
    flex: 1;
  }
`;

export const StyledMypage = styled(MypageBase)`
  h2 {
    font-size: 18px;
    font-weight: 700;
    margin-top: 60px;
    margin-bottom: 20px;
  }
`;

export const Mypage =
  process.env.NODE_ENV === 'production'
    ? StyledMypage
    : (props: MypageProps) => <StyledMypage {...props} />;
