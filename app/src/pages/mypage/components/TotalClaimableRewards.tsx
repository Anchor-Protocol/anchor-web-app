import {
  AnimateNumber,
  demicrofy,
  formatANCWithPostfixUnits,
  formatUST,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ANC, UST } from '@anchor-protocol/types';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { Sub } from 'components/Sub';
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
        <h4>
          <IconSpan>
            Total Claimable Rewards{' '}
            <InfoTooltip>
              Total number of claimable ANC from UST Borrow and LP staking
            </InfoTooltip>
          </IconSpan>
        </h4>
        <p>
          <AnimateNumber format={formatANCWithPostfixUnits}>
            {total?.reward ? demicrofy(total.reward) : (0 as ANC<number>)}
          </AnimateNumber>
          <Sub> ANC</Sub>
        </p>
        <p>
          <AnimateNumber format={formatUSTWithPostfixUnits}>
            {total?.rewardValue
              ? demicrofy(total.rewardValue)
              : (0 as UST<number>)}
          </AnimateNumber>{' '}
          UST
        </p>
      </header>

      <div className="anc-price">
        <h5>ANC PRICE</h5>
        <p>
          <AnimateNumber format={formatUST}>
            {ancPrice ? ancPrice.ANCPrice : (0 as UST<number>)}
          </AnimateNumber>
          <Sub> UST</Sub>
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

      sub {
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

      sub {
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
