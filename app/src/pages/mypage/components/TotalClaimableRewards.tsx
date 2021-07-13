import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatUST,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { fixHMR } from 'fix-hmr';
import { useRewards } from 'pages/mypage/logics/useRewards';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface TotalClaimableRewardsProps {
  className?: string;
}

function TotalClaimableRewardsBase({ className }: TotalClaimableRewardsProps) {
  const { total, ancPrice } = useRewards();

  return (
    <Section className={className}>
      <header>
        <h4>Total Claimable Rewards</h4>
        <p>
          {total?.reward
            ? formatANCWithPostfixUnits(demicrofy(total.reward))
            : 0}
          <span> ANC</span>
        </p>
        <p>
          {total?.rewardValue
            ? formatUSTWithPostfixUnits(demicrofy(total.rewardValue))
            : 0}{' '}
          UST
        </p>
      </header>

      <div className="anc-price">
        <h5>ANC PRICE</h5>
        <p>
          {ancPrice ? formatUST(ancPrice.ANCPrice) : 0}
          <span> UST</span>
        </p>
      </div>

      <div className="spacer" />

      <ActionButton className="claim" component={Link} to={`/claim/all`}>
        Claim All Rewards
      </ActionButton>
    </Section>
  );
}

export const StyledTotalClaimableRewards = styled(TotalClaimableRewardsBase)`
  .NeuSection-content {
    display: flex;
    flex-direction: column;

    height: 100%;
  }

  header {
    h4 {
      font-size: 16px;
      margin-bottom: 10px;
    }

    p:nth-of-type(1) {
      font-size: clamp(20px, 8vw, 36px);
      font-weight: 500;

      span {
        font-size: 20px;
      }
    }

    p:nth-of-type(2) {
      margin-top: 7px;

      font-size: 13px;
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .anc-price {
    margin-top: 40px;

    h5 {
      font-size: 13px;
      font-weight: 500;
    }

    p {
      margin-top: 6px;

      font-size: 28px;
      font-weight: 500;

      span {
        font-size: 13px;
      }
    }
  }

  .spacer {
    flex: 1;
  }

  @media (max-width: 1200px) {
    .anc-price {
      margin-top: 30px;
    }

    .spacer {
      min-height: 30px;
    }
  }
`;

export const TotalClaimableRewards = fixHMR(StyledTotalClaimableRewards);
